<template>
  <div>
    <h2>{{ page }}</h2>
    <router-link to="gray">Go to gray page</router-link>
    <router-link to="blue">Go to blue page</router-link>
  </div>
</template>

<script>
export default {
  name: 'White',
  data () {
    return {
      page: 'This a white page'
    }
  }
}
</script>
