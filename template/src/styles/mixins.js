module.exports = {
  mixins: {
    clearfix: {
      '&::after': {
        content: '""',
        display: 'table',
        clear: 'both'
      }
    },
    image: (mixin, name) => ({
      display: 'inline-block',
      width: '200px',
      height: '200px',
      background: `url(assets/${name}.png)`
    })
  }
}
