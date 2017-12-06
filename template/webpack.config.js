/* =====================================
                  MODULES
   ===================================== */

/* --------------- Native -------------- */

const { resolve } = require('path')

/* -------------- Installed ------------ */

const webpack = require('webpack')
const webpackNodeExternals = require('webpack-node-externals')
const eslintFriendlyFormatter = require('eslint-friendly-formatter')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

/* ===================================== */

const paths = {
  src: resolve(__dirname, './src'),
  images: resolve(__dirname, './src/images'),
  public: resolve(__dirname, './public'),
  clientEntry: resolve(__dirname, './src/client.js'),
  serverEntry: resolve(__dirname, './src/server.js')
}

module.exports = function () {
  const isDev = process.env.NODE_ENV === 'development'
  const isProd = process.env.NODE_ENV === 'production'
  const isClient = process.env.VUE_ENV === 'client'
  const isServer = process.env.VUE_ENV === 'server'

  const config = {
    entry: paths.serverEntry,
    output: {
      path: paths.public,
      publicPath: '/public/',
      filename: '[name].[chunkhash].js'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'images': paths.images
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          enforce: 'pre',
          options: {
            formatter: eslintFriendlyFormatter
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          include: paths.src,
          options: {
            extractCSS: process.env.NODE_ENV === 'production',
            preserveWhitespace: false
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: paths.src
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    },
    performance: {
      maxEntrypointSize: 300000
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          VUE_ENV: JSON.stringify(process.env.VUE_ENV)
        }
      })
    ]
  }

  if (isDev) {
    config.output.path = '/public'
    config.output.filename = '[name].js'
    config.devtool = '#source-map'
    config.plugins.push(
      new FriendlyErrorsWebpackPlugin()
    )
  }

  if (isDev && isClient) {
    config.entry = ['webpack-hot-middleware/client', paths.clientEntry]
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
  }

  if (isProd) {
    config.performance.hints = 'warning'
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new ExtractTextWebpackPlugin({
        filename: 'common.[chunkhash].css'
      })
    )
  }

  if (isProd && isClient) {
    config.entry = paths.clientEntry
    config.plugins.push(
      new SWPrecacheWebpackPlugin({
        cacheId: 'iloginow-vue',
        filename: 'service-worker.js',
        minify: true,
        dontCacheBustUrlsMatching: /./,
        staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
        runtimeCaching: [
          {
            urlPattern: '/',
            handler: 'networkFirst'
          },
          {
            urlPattern: /\/(gray|blue)/,
            handler: 'networkFirst'
          }
        ]
      })
    )
  }

  if (isClient) {
    config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: module => {
          return /node_modules/.test(module.context) && !/\.css$/.test(module.request)
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
      }),
      new VueSSRClientPlugin()
    )
  }

  if (isServer) {
    config.target = 'node'
    config.output.libraryTarget = 'commonjs2'
    config.externals = webpackNodeExternals({ whitelist: /\/.css$/ })
    config.plugins.push(
      new VueSSRServerPlugin()
    )
  }

  return config
}
