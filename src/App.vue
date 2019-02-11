<template>
  <v-app id="app" ref="app" style="position:relative;">
    <v-toolbar :color="online ? 'primary' : 'error'">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>My personal expenses</v-toolbar-title>
    </v-toolbar>
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-tabs v-model="tab_model" fixed-tabs color="transparent">
            <v-tab key="bills" @click="Redirect('/bills')">
              Bills
            </v-tab>
            <v-tab key="expenses" @click="Redirect('/expenses')">
              Expenses
            </v-tab>
          </v-tabs>
        </v-flex>
        <v-flex xs12>
          <router-view></router-view>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar v-model="disconnected_snack" color="red" bottom left :timeout="0">
      You are disconnected. 
      <v-btn flat @click="disconnected_snack = false" color="error">
        Close
      </v-btn>
    </v-snackbar>

    <v-snackbar v-model="queue_snack" top left color="info">
          New Expense in Queue!
          <v-btn @click="queue_snack = false" flat>
              Close
          </v-btn>
      </v-snackbar>

      <v-snackbar v-model="queue_done_snack" top left color="success">
          All expenses in queue saved!
          <v-btn @click="queue_done_snack = false" flat>
              Close
          </v-btn>
      </v-snackbar>
  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: 'app',
  data:()=>
  {
    return {
      online:true,
      disconnected_snack:false,
      tab_model:"bills",
      saldo:0,
      queue_snack:false,
      queue_done_snack:false,
      queue_progress:false
    };
  },
  mounted(){

    setInterval(()=>
    {
      this.online = window.navigator.onLine;

    },1000);
  },
  methods:{
    Redirect(url){
      if(url) {
        this.$router.push(url);
      }
    }
  },
  watch:{
    online(newVal,oldVal){
      if(!newVal){
        this.disconnected_snack = true;
      } else {
        this.disconnected_snack = false;

        let QUEUE = window.localStorage.getItem('expenses_queue');

        if(QUEUE && !this.queue_progress){
          QUEUE = JSON.parse(QUEUE);
          this.queue_progress = true;

          axios({
            url:"api/expenses_multi",
            method:"post",
            data: QUEUE
          })
          .then(res => 
          {
            console.log(res);
            this.queue_progress = false;
            if(res && res.data.message == "OK"){
              this.queue_done_snack = true;

              window.localStorage.removeItem('expenses_queue');
            }
          })
          .catch(err => 
          {
            this.queue_progress = false;
            if(err) swal("ERROR:",err.message,"error");
          })

        }

      }
    }
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
