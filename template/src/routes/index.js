const White = () => import('../components/White')
const Blue = () => import('../components/Blue')
const Gray = () => import('../components/Gray')

export default {
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path: '/',
      name: 'White',
      component: White,
      meta: {
        title: 'White | Vue Template'
      }
    },
    {
      path: '/gray',
      name: 'Gray',
      component: Gray,
      meta: {
        title: 'Gray | Vue Template'
      }
    },
    {
      path: '/blue',
      name: 'Blue',
      component: Blue,
      meta: {
        title: 'Blue | Vue Template'
      }
    }
  ]
}
