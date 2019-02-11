<template>
  <div class="hello">
      <v-container>
        <h1 style="font-size:10vh;">Hello!</h1>
        <p class="subtitle">
          This progressive web application is about handling your own expenses.
        </p>
      </v-container>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js PWA'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
