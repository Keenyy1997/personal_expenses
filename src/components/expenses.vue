<template id="expenses" ref="expenses">
    <div class="container">
        <span class="title font-weight-light">You have <strong>{{ expenses.length }}</strong> expenses</span>
        <v-btn icon @click="expense_search_modal = true" style="margin-left:1em;">
            <v-icon>
                search
            </v-icon>
        </v-btn>
        <hr>
        <v-layout row wrap mt-2>
            <v-flex xs12 v-if="expenses_queue.length > 0">
                <strong>In queue:</strong>
                <v-data-iterator content-tag="v-list" :items="expenses_queue" hide-actions style="position:relative;" three-line>
                    <template slot="item" slot-scope="props">
                        <v-list-tile class="elevation-2 mb-2" color="gray">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ props.item.name }}</v-list-tile-title>
                                <v-list-tile-sub-title>${{ ParseNumber(props.item.amount) }}</v-list-tile-sub-title>
                                <v-list-tile-sub-title class="text-xs-center">
                                    <small>{{ ParseDate(props.item.date) }}</small>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon @click="deleteExpense(props.item)" color="error">
                                    <v-icon>
                                        delete
                                    </v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </template>
                </v-data-iterator>
            </v-flex>
            <v-flex xs12>
                <v-data-iterator content-tag="v-list" :items="expenses" hide-actions style="position:relative;" three-line>
                    <template slot="item" slot-scope="props">
                        <v-list-tile class="elevation-2 mb-2">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ props.item.name }}</v-list-tile-title>
                                <v-list-tile-sub-title>${{ ParseNumber(props.item.amount) }}</v-list-tile-sub-title>
                                <v-list-tile-sub-title class="text-xs-center">
                                    <small>{{ ParseDate(props.item.date) }}</small>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn icon @click="deleteExpense(props.item)" color="error">
                                    <v-icon>
                                        delete
                                    </v-icon>
                                </v-btn>
                                <v-btn icon @click="showExpense(props.item)" small :disabled="props.item.location ? false : true">
                                    <v-icon>
                                        place
                                    </v-icon>
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </template>
                </v-data-iterator>
            </v-flex>
        </v-layout>

        <v-btn
            color="success"
            dark
            fixed
            bottom
            right
            style="bottom:50px;"
            fab
            @click="expense_add_modal = true;"
        >
            <v-icon>add</v-icon>
        </v-btn>

        <v-dialog v-model="expense_add_modal" width="500" lazy>
            <v-card style='padding:.5em;'>
                <v-container grid-list-xs>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-text-field label="Expense" v-model="expense_name"></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field label="Amount" :prefix="expense_amount ? '$' : ''" v-model="expense_amount" type="number"></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-dialog
                                ref="dialog"
                                v-model="modal"
                                :return-value.sync="date"
                                persistent
                                lazy
                                full-width
                                width="290px"
                            >
                                <v-text-field
                                slot="activator"
                                :value="ParseDate(date)"
                                label="Date"
                                readonly
                                ></v-text-field>
                                <v-date-picker v-model="date" scrollable>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                                <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs12>
                            <v-btn outline round color="primary" @click="addExpense()" block>
                                Save Expense
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog v-model="locked" width="300px" persistent lazy>
            <v-card color="info">
                <v-card-title>Loading...</v-card-title>
                <v-card-text>
                 <v-progress-linear indeterminate color="white"></v-progress-linear>  
                </v-card-text>  
            </v-card>    
        </v-dialog> 

        <v-dialog v-model="expense_search_modal" width="600" lazy>
            <v-card>
                <v-container grid-list-md>
                    <v-subheader>Search by...</v-subheader>
                    <v-layout row wrap px-2>
                        <v-layout row wrap>
                            <v-flex xs12 md4>
                                <v-text-field label="Expense" placeholder="Input the expense name..." v-model="search_expense"></v-text-field>
                            </v-flex>
                            <v-flex xs12 md4>
                                <v-menu
                                    v-model="search_month_menu"
                                    :close-on-content-click="false"
                                    :nudge-right="40"
                                    lazy
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                >
                                    <v-text-field
                                        slot="activator"
                                        v-model="search_month"
                                        label="By Month"
                                        readonly
                                    ></v-text-field>
                                    <v-date-picker v-model="search_month" @input="search_month_menu = false" type="month" no-title></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs12 md4>
                                <v-combobox label="By Day" :items="days" v-model="search_day"></v-combobox>
                            </v-flex>
                            <v-flex xs12 mt-3>
                                <v-btn block @click="expense_search_modal = false;fetchExpenses();" round outline color="primary">
                                    Search
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog v-model="expense_map_modal" lazy id="expense_map">
            <iframe :src="`https://maps.google.com/maps?q=${expense_map}&hl=es;z=14&amp;output=embed`" height="600" style="width:100%;" v-if="expense_map"></iframe>
        </v-dialog>
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'

export default {
    name:"expenses",
    data:()=>
    {
        return {
            expense_add_modal:false,
            expense_name:"",
            expense_amount:0,
            modal:false,
            date:new Date().toISOString().substr(0,10),
            expense_today:false,
            expenses:[],
            expenses_queue:[],
            expense_search_modal:false,
            search_expense:"",
            search_month:new Date().toISOString().substr(0,7),
            search_day:"",
            search_month_menu:false,
            days:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
            locked:false,
            expense_map:"",
            expense_map_modal:false
        };
    },
    methods:{
        addExpense(){
            let ExpenseItem = {
                name:"",
                amount:0,
                date:"",
                id:0,
                location:""
            };

            ExpenseItem.name = this.expense_name;
            ExpenseItem.amount = this.expense_amount || 0;
            ExpenseItem.date = this.date;

            if ('geolocation' in navigator) {

                navigator.geolocation.getCurrentPosition((location)=>
                {
                    ExpenseItem.location = location.coords.latitude + "," + location.coords.longitude;

                    let Online = this.$root.$children[0].online;

                    if(this.locked)
                        return;

                    this.locked = true;

                    if(Online){

                        axios({
                            url:"api/expenses",
                            method:"post",
                            data: ExpenseItem
                        })
                        .then(res => 
                        {
                            this.locked = false;
                            console.log(res);
                            if(res && res.data.message == "OK"){

                                ExpenseItem.id = res.data.insertId;

                                this.expenses.push(ExpenseItem);
                                this.expense_add_modal = false;
                                this.fetchExpenses();
                            }
                        })
                        .catch(err => 
                        {
                            this.locked = false;
                            console.log(err);
                        })

                    } else {
                        let ExpensesQUEUE = window.localStorage.getItem('expenses_queue');
                        if(ExpensesQUEUE){
                            ExpensesQUEUE = JSON.parse(ExpensesQUEUE);
                        } else {
                            ExpensesQUEUE = new Array();
                        }

                        ExpensesQUEUE.push(ExpenseItem);
                        window.localStorage.setItem('expenses_queue', JSON.stringify(ExpensesQUEUE));

                        this.$root.$children[0].queue_snack = true;
                        this.expenses_queue.push(ExpenseItem);
                        this.expense_add_modal = false;

                        this.locked = false;
                    }
                })
            } else {
                swal({
                    title:"You need Geolocation to add a new expense.",
                    icon:"info"
                })
            }
        },
        clear(){
            this.expense_name = "";
            this.expense_amount = 0;
            this.expense_date = new Date().toISOString().substr(0,10)
        },
        showExpense(item){
            if(item && item.location){
                this.expense_map = item.location;
                this.expense_map_modal = true;
            }
        },
        fetchExpenses(){

            if(this.locked)
                return;

            this.locked = true;

            let SearchItem = {
                expense:"",
                month:"",
                day:""
            };

            if(this.search_expense)
                SearchItem.expense = "%" + this.search_expense + "%";

            if(this.search_month)
                SearchItem.month = this.search_month;
            
            if(this.search_day)
                SearchItem.day = this.search_day;

            console.log(SearchItem);

            let Online = this.$root.$children[0].online;

            if(Online){

                axios({
                    url:"api/expenses",
                    method:"get",
                    params: SearchItem
                })
                .then(res => 
                {
                    console.log(res);
                    this.locked = false;
                    if(res && res.data.message == "OK"){
                        this.expenses = res.data.data;
                        if(!SearchItem.expense)
                            window.localStorage.setItem(`expenses_${SearchItem.month}`, JSON.stringify(res.data.data));
                    }
                })
                .catch(err => 
                {
                    this.locked = false;
                    console.log(err);
                })


            } else {
                let ExpensesRows = window.localStorage.getItem(`expenses_${SearchItem.month}`);
                let ExpensesQUEUE = window.localStorage.getItem('expenses_queue')

                if(ExpensesRows){

                    let ExpenseDate = SearchItem.month;

                    if(SearchItem.day)
                    {
                        if(SearchItem.day < 10)
                            ExpenseDate += "-0" + SearchItem.day;
                        else
                            ExpenseDate += "-" + SearchItem.day;
                    }

                    let ExpenseName = this.search_expense;


                    ExpensesRows = JSON.parse(ExpensesRows);

                    console.log(ExpenseName, ExpenseDate);

                    this.expenses = ExpensesRows.filter(x => {
                        if(ExpenseName != ""){
                            if((x.name.toLowerCase()).indexOf(ExpenseName.toLowerCase()) >= 0)
                            {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            if(x.date.indexOf(ExpenseDate) >= 0){
                                return true;
                            } else {
                                return false;
                            }
                        }
                    })
                }

                if(ExpensesQUEUE) {
                    this.expenses_queue = JSON.parse(ExpensesQUEUE);
                }

                this.locked = false;
            }
        },
        ParseDate(date){
            if(date){

                date = date.substr(0,10);

                let [year,month,day] = date.split("-");

                let Months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

                return Months[parseInt(month)-1]+ " " + day + ", " + year;
            }
            return "";
        },
        deleteExpense(expense){

            if(this.locked)
                return;

            this.locked = true;

            if(expense){

                if(expense.id > 0){
                    let Online = this.$root.$children[0].online;
                    if(!Online){
                        swal("ERROR:","This option is only available when you're online.","error")
                        this.locked = false;
                        return;
                    }

                    axios({
                        url:"api/expenses_delete",
                        method:"post",
                        data:{
                            id: expense.id
                        }
                    })
                    .then(res => 
                    {
                        this.locked = false;
                        console.log(res)
                        if(res && res.data.message == "OK") {
                            let Index = this.expenses.indexOf(expense);
                            this.expenses.splice(Index, 1);

                            window.localStorage.setItem('expenses', JSON.stringify(this.expenses));
                        }
                    })
                    .catch(err => 
                    {
                        this.locked = false;
                        if(err) swal("ERROR:",err.message,"error");
                    })

                    
                } else {
                    let QUEUE = window.localStorage.getItem('expenses_queue');

                    if(QUEUE){
                        QUEUE = JSON.parse(QUEUE);
                        this.locked = false;

                        let Index = QUEUE.indexOf(expense);
                        QUEUE.splice(Index, 1);

                        window.localStorage.setItem('expenses_queue', JSON.stringify(QUEUE));

                        Index = this.expenses_queue.indexOf(expenses);
                        this.expenses_queue.splice(Index, 1);
                        
                    }
                }
            }
        },
        ParseNumber(number){
            return parseFloat(number).toFixed(2);
        },
    },
    mounted(){
        this.fetchExpenses();

        setInterval(()=>
        {
            let ExpensesQUEUE = window.localStorage.getItem('expenses_queue');

            if(ExpensesQUEUE) {
                ExpensesQUEUE = JSON.parse(ExpensesQUEUE);
                this.expenses_queue = ExpensesQUEUE;
            } else {
                this.expenses_queue = [];
            }

            if(this.$root.$children[0].force_refresh == true){
                this.fetchExpenses();
                this.$root.$children[0].force_refresh = false;
            }
        },1000);
    },
    computed:{
        TotalExpenses(){
            let Sum = 0;

            if(this.expenses.length > 0){
                for(let i =0;i < this.expenses.length;i++){
                    Sum += parseFloat(this.expenses[i].amount);
                }
            }
            return Sum;
        }
    },
    watch:{
        expense_add_modal(newVal,oldVal){
            if(!newVal){
                this.expense_name = "";
                this.expense_amount = 0;
                this.date = new Date().toISOString().substr(0,10);
            }
        },
        expense_map_modal(newVal,oldVal){
            if(!newVal){
                this.expense_map = "";
            }
        }
    }
}
</script>
<style scoped>  
    .container{
        width:100%;
        padding:0 .5em;
        box-sizing: border-box;
        max-width:1400px;
        margin:auto;
        text-align:left;
    }

    .btn--success{
        background: lightgreen;
        font-weight: bold;
    }

    form.input_form{
        width:80%;
        margin:.5em auto;
    }

    form.input_form > input{
        width:100%;
        display:block;
    }

    form.input_form_button{
        width:30%;
        margin:.5em auto;
    }
</style>
