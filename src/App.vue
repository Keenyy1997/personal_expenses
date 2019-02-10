<template>
  <div id="app">
    <header :class="online ? '' : 'error'">
      <span>My Finances</span
      ><p style="text-align:right;">Saldo: $ {{ saldo }}</p>
      <cite v-if="!online" style='color:white;'>You are not connected!</cite>
    </header>
    <nav>
      <router-link to="/bills">Bills</router-link>
      <router-link to="/expenses">Expenses</router-link>
    </nav>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app',
  data:()=>
  {
    return {
      online:true,
      saldo:0
    };
  },
  mounted(){

    setInterval(()=>
    {
      this.online = window.navigator.onLine;
    },1000);
  }
}
</script>

<style>
body {
  margin: 0;
}
.error{
  background:red;
}

nav {
  width:90%;
  margin:.5em auto;
  text-align:center;
}

nav > a {
  font-size:2em;
  text-transform: uppercase;
  padding:.5em;
  box-sizing: border-box;
  margin:0 .25em;
  width:100px;
  text-decoration: none;
}

nav > a:hover {
  border-bottom:1mm solid lightslategray;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
