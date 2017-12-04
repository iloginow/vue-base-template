/* =====================================
                  MODULES
   ===================================== */

/* --------------- Native -------------- */

const fs = require('fs')
const { resolve } = require('path')

/* -------------- Installed ------------ */

const lruCache = require('lru-cache')
const koaFavicon = require('koa-favicon')
const koaCompress = require('koa-compress')
const koaCacheLite = require('koa-cache-lite')
const koaStatic = require('koa-static')
const koaMount = require('koa-mount')
const Koa = require('koa')
const { createBundleRenderer } = require('vue-server-renderer')

/* ---------------- Local -------------- */

const vueSSRServerBundle = require('./public/vue-ssr-server-bundle.json')
const vueSSRClientManifest = require('./public/vue-ssr-client-manifest.json')

/* ===================================== */

const paths = {
  template: resolve(__dirname, './src/index.html'),
  images: resolve(__dirname, './src/images'),
  favicon: resolve(__dirname, './src/images/logo-48.png'),
  manifest: resolve(__dirname, './src/manifest.json'),
  public: resolve(__dirname, './public'),
  serviceWorker: resolve(__dirname, './public/service-worker.js')
}

/* =====================================
             PRODUCTION SERVER
   ===================================== */

const app = new Koa()
const port = process.env.PORT || 8080
const template = fs.readFileSync(paths.template, 'utf-8')

// Initialize Vue bundle renderer
const renderer = createBundleRenderer(vueSSRServerBundle, {
  cache: lruCache({
    max: 1000,
    maxAge: 1000 * 60 * 15
  }),
  basedir: paths.public,
  runInNewContext: false,
  template,
  clientManifest: vueSSRClientManifest
})

// Routes cache
koaCacheLite.configure({
  '/': 3000,
  '/blue': 3000,
  '/gray': 3000,
  '/public': 10000,
  '/images': 10000
})

// Use compression and serve favicon
app.use(koaCompress({ threshold: 0 }))
app.use(koaFavicon(paths.favicon))

// Public directory server
const servePublic = new Koa()
servePublic.use(koaStatic(paths.public))

// Images server
const serveImages = new Koa()
serveImages.use(koaStatic(paths.images))

// Mount static servers to the main app
app.use(koaMount('/public', servePublic))
app.use(koaMount('/images', serveImages))

// Take care of the PWA related stuff
app.use(koaStatic(paths.manifest))
app.use(koaStatic(paths.serviceWorker))

// Deliver the html
app.use(async ctx => {
  const context = {
    title: 'iLogiNow Vue Template',
    url: ctx.url
  }

  renderer.renderToString(context, (error, html) => {
    try {
      if (error) throw error
      ctx.body = html
    } catch (err) {
      if (err.code === 302 && err.url) {
        ctx.redirect(err.url)
      } else {
        ctx.status = err.code
        ctx.message = (`${err.code} | ${err.message}`)
        if (err.code === 500) {
          console.error(`error during render : ${ctx.url}`)
          console.error(err.stack)
        }
      }
    }
  })
})

app.listen(port, () => console.log(`server started at localhost:${port}`))
