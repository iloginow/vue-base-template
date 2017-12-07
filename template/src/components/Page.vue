<template>
  <div :class="classes">
    <img src="../images/logo-192.png" alt="logo">
    <h1>\{{ msg }}</h1>
    <router-view/>
    <p>\{{ vuex }}</p>
    <div class="count">\{{ count }}</div>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Page',
  data () {
    return {
      msg: 'Welcome to your Vue.js app',
      vuex: 'Here\'s a simple counter, just to make sure Vuex is doing allright;)'
    }
  },
  computed: {
    classes () {
      return ['page', this.color]
    },
    ...mapGetters(['color', 'count'])
  },
  methods: {
    ...mapActions(['increment', 'decrement'])
  }
}
</script>

<style>
.page {
  padding: 60px 0;
  text-align: center;
  height: 100vh;
  box-sizing: border-box;
}

.blue {
  background-color: #94CDE7;
}

.gray {
  background-color: #C7C7C7;
}

.count {
  font-size: 1.5rem;
}
</style>
