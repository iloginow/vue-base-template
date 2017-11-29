const variables = require('./src/styles/variables')
const mixins = require('./src/styles/mixins')
const fonts = require('./src/styles/fonts')
const breakpoints = require('./src/styles/breakpoints')

module.exports = {
  'plugins': {
    'postcss-font-magician': fonts,
    'postcss-mixins': mixins,
    'postcss-advanced-variables': variables,
    'postcss-custom-media': breakpoints,
    'postcss-normalize': {},
    'postcss-color-function': {},
    'postcss-nested': {},
    'postcss-extend': {},
    'postcss-flexbox': {},
    'autoprefixer': {}
  }
}
