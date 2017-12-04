<template>
  <div>
    <h2>\{{ page }}</h2>
    <router-link to="/">Go to white page</router-link>
    <router-link to="gray">Go to gray page</router-link>
  </div>
</template>

<script>
export default {
  name: 'Blue',
  data () {
    return {
      page: 'This is a blue page'
    }
  }
}
</script>
