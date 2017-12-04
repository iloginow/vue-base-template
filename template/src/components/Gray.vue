<template>
  <div>
    <h2>\{{ page }}</h2>
    <router-link to="/">Go to white page</router-link>
    <router-link to="blue">Go to blue page</router-link>
  </div>
</template>

<script>
export default {
  name: 'Gray',
  data () {
    return {
      page: 'This is a gray page'
    }
  }
}
</script>
