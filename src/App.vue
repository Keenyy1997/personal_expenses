<template>
  <v-app id="app" ref="app" style="position:relative;">
    <v-toolbar :color="online ? 'primary' : 'error'">
      <!-- <v-toolbar-side-icon></v-toolbar-side-icon> -->
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
      queue_progress:false,
      force_refresh:false
    };
  },
  mounted(){

    setInterval(()=>
    {
      this.online = window.navigator.onLine;
    },1000);

    this.SaveQueue();
    
  },
  methods:{
    Redirect(url){
      if(url) {
        this.$router.push(url);
      }
    },
    SaveQueue(){
      let QUEUE = window.localStorage.getItem('expenses_queue');

        if(QUEUE && QUEUE.length > 0){
          if(this.queue_progress)
            return;
          
          this.queue_progress = true;
          QUEUE = JSON.parse(QUEUE);

          let RealQUEUE = new Array();

          for(let i = 0;i < QUEUE.length;i++){
            
            let Current = QUEUE[i];

            if(RealQUEUE.indexOf(Current) == -1)
              RealQUEUE.push(Current);
          }

          axios({
            url:"api/expenses_multi",
            method:"post",
            data: RealQUEUE
          })
          .then(res => 
          {
            console.log(res);
            this.queue_progress = false;
            if(res && res.data.message == "OK"){
              window.localStorage.removeItem('expenses_queue');
              this.queue_done_snack = true;

              if(this.$router.history.current && this.$router.history.current.name == "Expenses"){
                this.force_refresh = true;
              }

            }
          })
          .catch(err => 
          {
            this.queue_progress = false;
            if(err) swal("ERROR:",err.message,"error");
          })

        }
    }
  },
  watch:{
    online(newVal,oldVal){
      if(!newVal){
        this.disconnected_snack = true;
      } else {
        this.disconnected_snack = false;

        this.SaveQueue()
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
