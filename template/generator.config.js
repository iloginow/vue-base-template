module.exports = {
  'customRoot': {{#useCustomRoot}}'{{ customRoot }}'{{/useCustomRoot}}{{#unless useCustomRoot}}false{{/unless}},
  'routesToPrerender': [
    '/',
    '/gray',
    '/blue'
  ]
}
