<template>
  <div class="page">
    <img src="../images/logo.svg" alt="logo">
    <h1>{{ msg }}</h1>
    <h2>{{ page }}</h2>
    <router-link to="gray">Go to gray page</router-link>
    <router-link to="blue">Go to blue page</router-link>
  </div>
</template>

<script>
export default {
  name: 'Hello',
  data () {
    return {
      msg: 'Welcome to your Vue.js app',
      page: 'This a hello page'
    }
  }
}
</script>

<style>
.page {
  padding: 60px 0;
  text-align: center;
}
</style>
