/* =====================================
                  MODULES
   ===================================== */

/* --------------- Native -------------- */

const fs = require('fs')
const { resolve } = require('path')

/* -------------- Installed ------------ */

const webpack = require('webpack')
const chokidar = require('chokidar')
const lruCache = require('lru-cache')
const koaWebpack = require('koa-webpack')
const koaStatic = require('koa-static')
const koaMount = require('koa-mount')
const Koa = require('koa')
const MemoryFS = require('memory-fs')
const { createBundleRenderer } = require('vue-server-renderer')

/* ---------------- Local -------------- */

const webpackConfig = require('./webpack.config.js')

/* ===================================== */

const paths = {
  template: resolve(__dirname, './src/index.html'),
  images: resolve(__dirname, './src/images'),
  favicon: resolve(__dirname, './src/images/logo-48.png')
}

function getWebpackConfig (target) {
  process.env.VUE_ENV = target
  process.env.NODE_ENV = 'development'
  return webpackConfig()
}

function readTemplate () {
  return fs.readFileSync(paths.template, 'utf-8')
}

/* =====================================
           DEVELOPMENT SERVER
   ===================================== */

const app = new Koa()
const inMemoryFS = new MemoryFS()
const port = process.env.PORT || 3000

const clientConfig = getWebpackConfig('client')
const serverConfig = getWebpackConfig('server')
const clientCompiler = webpack(clientConfig)
const serverCompiler = webpack(serverConfig)

clientCompiler.outputFileSystem = inMemoryFS
serverCompiler.outputFileSystem = inMemoryFS

// Build the client bundle and watch
app.use(koaWebpack({
  compiler: clientCompiler,
  dev: {
    noInfo: true,
    publicPath: clientConfig.output.publicPath
  }
}))

// Read template from disk and watch
app.use(async (ctx, next) => {
  app.context.template = readTemplate()
  await next()
  chokidar.watch(paths.template).on('change', () => {
    app.context.template = readTemplate()
    console.log('index.html template updated')
    next()
  })
})

// Build the server bundle and watch
app.use(async (ctx, next) => {
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) next()
  })
  await next()
})

// Serve public directory from in-memory file system
const servePublic = new Koa()
servePublic.use(async (ctx, next) => {
  await next()
  try {
    ctx.body = inMemoryFS.readFileSync(ctx.url)
  } catch (err) {
    ctx.status = 404
  }
})

// Serve static assets from disk
const serveImages = new Koa()
serveImages.use(koaStatic(paths.images))

// Mount static servers to the main app
app.use(koaMount('/public', servePublic))
app.use(koaMount('/images', serveImages))

// Finally, use vue bundle renderer to deliver the html
app.use(async ctx => {
  let serverBundle = JSON.parse(inMemoryFS.readFileSync('/public/vue-ssr-server-bundle.json'))
  let clientManifest = JSON.parse(inMemoryFS.readFileSync('/public/vue-ssr-client-manifest.json'))
  let renderer = createBundleRenderer(serverBundle, {
    cache: lruCache({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    template: ctx.template,
    clientManifest
  })

  const context = {
    title: '{{ name }}',
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
