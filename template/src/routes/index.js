const Hello = () => import('../components/Hello')
const Gray = () => import('../components/Gray')
const Blue = () => import('../components/Blue')

export default {
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
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
