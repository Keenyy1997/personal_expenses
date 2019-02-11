<template id="expenses" ref="expenses">
    <div class="container">
        <h2 class="header">You have {{ expenses.length }} this month!
            <v-btn icon @click="fetchExpenses()">
                <v-icon>
                    reload
                </v-icon>
            </v-btn>
        </h2>
        <hr>
        <v-layout row wrap mt-2>
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
        };
    },
    methods:{
        addExpense(){
            let ExpenseItem = {
                name:"",
                amount:0,
                date:"",
                id:0
            };

            ExpenseItem.name = this.expense_name;
            ExpenseItem.amount = this.expense_amount || 0;
            ExpenseItem.date = this.date;

            let Online = this.$root.$children[0].online;

            if(Online){

                axios({
                    url:"api/expenses",
                    method:"post",
                    data: {
                        name: ExpenseItem.name,
                        amount: ExpenseItem.amount,
                        date: ExpenseItem.date
                    }
                })
                .then(res => 
                {
                    console.log(res);
                    if(res && res.data.message == "OK"){

                        ExpenseItem.id = res.data.insertId;

                        this.expenses.push(ExpenseItem);
                        this.expense_add_modal = false;
                    }
                })
                .catch(err => 
                {
                    console.log(err);
                })

            } else {
                let ExpensesRows = window.localStorage.getItem('expenses');
                let ExpensesQUEUE = window.localStorage.getItem('expenses_queue');

                if(ExpensesRows)
                    ExpensesRows = JSON.parse(ExpensesRows);
                else
                    ExpensesRows = new Array();

                if(ExpensesQUEUE){
                    ExpensesQUEUE = JSON.parse(ExpensesQUEUE);
                } else {
                    ExpensesQUEUE = new Array();
                }

                ExpensesQUEUE.push(ExpenseItem);
                window.localStorage.setItem('expenses_queue', JSON.stringify(ExpensesQUEUE));

                this.$root.$children[0].queue_snack = true;

                ExpensesRows.push(ExpenseItem);

                window.localStorage.setItem('expenses', JSON.stringify(ExpensesRows));

                this.expenses.push(ExpenseItem);
                this.expense_add_modal = false;
            }

            
            
            
        },
        clear(){
            this.expense_name = "";
            this.expense_amount = 0;
            this.expense_date = new Date().toISOString().substr(0,10)
        },
        fetchExpenses(){

            console.log(this);

            let Online = this.$root.$children[0].online;

            console.log(Online);

            if(Online){

                axios({
                    url:"api/expenses",
                    method:"get",
                })
                .then(res => 
                {
                    console.log(res);
                    if(res && res.data.message == "OK"){
                        this.expenses = res.data.data;
                        window.localStorage.setItem('expenses', JSON.stringify(res.data.data));
                    }
                })
                .catch(err => 
                {
                    console.log(err);
                })


            } else {
                let ExpensesRows = window.localStorage.getItem('expenses');

                if(ExpensesRows){
                    this.expenses = JSON.parse(ExpensesRows);
                }
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
            if(expense){
                let Index = this.expenses.indexOf(expense);
                this.expenses.splice(Index, 1);

                window.localStorage.setItem('expenses', JSON.stringify(this.expenses));
            }
        },
        ParseNumber(number){
            return parseFloat(number).toFixed(2);
        }
    },
    mounted(){
        this.fetchExpenses();
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
