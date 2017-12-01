export default {
  count: state => {
    return state.count
  },
  color: state => {
    return state.route.name.toLowerCase()
  }
}
