module.exports = {
  'customRoot': {{#customRoot}}'{{ customRoot }}'{{/customRoot}}{{#unless useCutomRoot}}false{{/unless}},
  'routesToPrerender': [
    '/',
    '/gray',
    '/blue'
  ]
}
