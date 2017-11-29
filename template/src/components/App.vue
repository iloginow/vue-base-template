<template>
  <div id="app">
    <router-view/>
    <vue-progress-bar/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    this.$Progress.finish()
  },
  created () {
    this.$Progress.start()
    this.$router.beforeEach((to, from, next) => {
      if (to.meta.progress !== undefined) {
        let meta = to.meta.progress
        this.$Progress.parseMeta(meta)
      }
      this.$Progress.start()
      next()
    })
    this.$router.afterEach((to, from) => {
      this.$Progress.finish()
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
