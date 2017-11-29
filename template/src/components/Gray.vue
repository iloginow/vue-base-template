<template>
  <div class="page gray">
    <img src="../images/logo.svg" alt="logo">
    <h1>{{ msg }}</h1>
    <router-link to="/">Go to hello page</router-link>
    <router-link to="blue">Go to blue page</router-link>
  </div>
</template>

<script>
export default {
  name: 'Gray',
  data () {
    return {
      msg: 'This is a gray page'
    }
  }
}
</script>

<style>
.page {
  padding: 60px 0;
  text-align: center;
}

.gray {
  background-color: #C7C7C7;
}
</style>
