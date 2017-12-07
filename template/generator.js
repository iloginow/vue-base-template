/* =====================================
                  MODULES
   ===================================== */

/* --------------- Native -------------- */

const fs = require('fs')
const http = require('http')
const { resolve } = require('path')

/* -------------- Installed ------------ */

const lruCache = require('lru-cache')
const serverDestroy = require('server-destroy')
const koaFavicon = require('koa-favicon')
const Koa = require('koa')
const Crawler = require('crawler')
const { createBundleRenderer } = require('vue-server-renderer')

/* ---------------- Local -------------- */

const vueSSRServerBundle = require('./public/vue-ssr-server-bundle.json')
const vueSSRClientManifest = require('./public/vue-ssr-client-manifest.json')
const config = require('./generator.config.js')

/* ===================================== */

const paths = {
  template: resolve(__dirname, './src/index.html'),
  images: resolve(__dirname, './src/images'),
  favicon: resolve(__dirname, './src/images/logo-48.png'),
  manifest: resolve(__dirname, './src/manifest.json'),
  public: resolve(__dirname, './public'),
  static: resolve(__dirname, './static'),
  staticPublic: resolve(__dirname, './static/public'),
  staticImages: resolve(__dirname, './static/images'),
  staticManifest: resolve(__dirname, './static/manifest.json')
}

/* =====================================
           STATIC SITE GENERATOR
   ===================================== */

const app = new Koa()
const port = process.env.PORT || 8080
const template = fs.readFileSync(paths.template, 'utf-8')

// Create a server instance
const server = http.createServer(app.callback())

// And make it destroyable
serverDestroy(server)

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

// Serve favicon
app.use(koaFavicon(paths.favicon))

// If we have a custom root, we need to fix the links
function fixLinks (string) {
  if (config.customRoot) {
    const linksToFix = [
      {
        from: /\/images/g,
        to: `${config.customRoot}/images`
      },
      {
        from: /\/public/g,
        to: `${config.customRoot}/public`
      },
      {
        from: /\/service-worker.js/g,
        to: `${config.customRoot}/service-worker.js`
      },
      {
        from: /\/manifest.json/,
        to: `${config.customRoot}/manifest.json`
      },
      {
        from: /"start_url": "\/"/,
        to: `"start_url": "/${config.customRoot}"`
      },
      {
        from: /router.get("\/"/,
        to: `router.get("/${config.customRoot}"`
      },
      {
        from: /router.get(\/\\\//,
        to: `router.get(/\\/${config.customRoot})`
      }
    ]
    linksToFix.forEach(pattern => {
      string = string.replace(pattern.from, pattern.to)
    })
  }
  return string
}

// Render HTML
app.use(async (ctx, next) => {
  const context = {
    title: 'iLogiNow Vue Template',
    url: ctx.url
  }
  // And put it in a file when a route gets called
  renderer.renderToString(context, (error, html) => {
    let filename = resolve(paths.static, `.${ctx.path}`, 'index.html')
    try {
      if (error) throw error
      fs.createWriteStream(filename).write(fixLinks(html))
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

function createStaticDir () {
  try {
    fs.mkdirSync(paths.static)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

const crawler = new Crawler({
  jQuery: false
})

// Copy public directory
fs.readdir(paths.public, (err, files) => {
  if (err) {
    console.error(err)
  } else {
    createStaticDir()
    fs.mkdirSync(paths.staticPublic)
    files.forEach(file => {
      let contents = fs.readFileSync(resolve(paths.public, file), 'utf-8')
      if (file === 'service-worker.js') {
        fs.writeFileSync(resolve(paths.static, file), fixLinks(contents))
      } else {
        fs.writeFileSync(resolve(paths.staticPublic, file), fixLinks(contents))
      }
    })
  }
})

// Copy images directory
fs.readdir(paths.images, (err, files) => {
  if (err) {
    console.error(err)
  } else {
    createStaticDir()
    fs.mkdirSync(paths.staticImages)
    files.forEach(file => {
      let contents = fs.readFileSync(resolve(paths.images, file))
      fs.writeFileSync(resolve(paths.staticImages, file), contents)
    })
  }
})

// Copy manifest.json
createStaticDir()
let manifest = fs.readFileSync(paths.manifest)
fs.writeFileSync(paths.staticManifest, fixLinks(manifest))

// Listen for requests
server.listen(port)

// Crawl all the routes we need to prerender
createStaticDir()
let done = 0
config.routesToPrerender.forEach((route, i, arr) => {
  if (route !== '/') fs.mkdirSync(resolve(paths.static, `.${route}`))
  crawler.queue({
    uri: `http://localhost:${port + route}`,
    callback: () => {
      done += 1
      // Shut down the server when everything is done
      if (done === arr.length) server.destroy()
    }
  })
})
