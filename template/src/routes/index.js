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
      component: White
    },
    {
      path: '/gray',
      name: 'Gray',
      component: Gray
    },
    {
      path: '/blue',
      name: 'Blue',
      component: Blue
    }
  ]
}
