<template>
  <div id="app">
    <Page/>
    <vue-progress-bar/>
  </div>
</template>

<script>
import Page from './Page'

export default {
  name: 'App',
  components: {
    Page
  },
  mounted () {
    this.$Progress.finish()
  },
  created () {
    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        this.$Progress.parseMeta(to.meta.progress)
      }
      this.$Progress.start()
      next()
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
      document.title = to.meta.title
    })
  }
}
</script>

<style>
@import-normalize;

body {
  margin: 0;
  color: $primary-color;
  font-family: 'Roboto Condensed', sans-serif;
}

img[alt="logo"] {
  width: 200px;
  height: 200px;
}

a {
  display: block;
}
</style>
