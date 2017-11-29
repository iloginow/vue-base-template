<template>
  <div class="page blue">
    <img src="../images/logo.svg" alt="logo">
    <h1>{{ msg }}</h1>
    <router-link to="/">Go to hello page</router-link>
    <router-link to="gray">Go to gray page</router-link>
  </div>
</template>

<script>
export default {
  name: 'Blue',
  data () {
    return {
      msg: 'This is a blue page'
    }
  }
}
</script>

<style>
.page {
  padding: 60px 0;
  text-align: center;
}

.blue {
  background-color: #94CDE7;
}
</style>
