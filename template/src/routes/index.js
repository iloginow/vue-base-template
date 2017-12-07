const White = () => import('../components/White')
const Blue = () => import('../components/Blue')
const Gray = () => import('../components/Gray')

export default {
  mode: 'history',
  base: {{#useCustomRoot}}'{{customRoot}}/'{{/useCustomRoot}}{{#unless useCustomRoot}}__dirname{{/unless}},
  routes: [
    {
      path: '/',
      name: 'White',
      component: White,
      meta: {
        title: 'Vue Template | White'
      }
    },
    {
      path: '/gray',
      name: 'Gray',
      component: Gray,
      meta: {
        title: 'Vue Template | Gray'
      }
    },
    {
      path: '/blue',
      name: 'Blue',
      component: Blue,
      meta: {
        title: 'Vue Template | Blue'
      }
    }
  ]
}
