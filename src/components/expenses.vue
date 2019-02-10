<template id="expenses" ref="expenses">
    <div class="container">
        <h1>You have {{ expenses.length }} this month!</h1>
        <hr>
        <form onsubmit="event.preventDefault();" style="width:45%;margin-right:2.49%;display:inline-block;vertical-align:top;">
            <div class="input_form">
                <input type='text' v-model="expense_name" placeholder="Expense" style="width:100%;margin-bottom:.5em;padding:.5em;"/>
            </div>
            <div class="input_form">
                <input type='number' v-model="expense_amount" placeholder="Amount" style="width:100%;margin-bottom:.5em;padding:.5em;"/>
            </div>
            <div class="input_form">
                <input type='date' v-model="expense_date" placeholder="Date" style="width:100%;margin-bottom:.5em;padding:.5em;"/>
            </div>
            <div class="input_form_button">
                <button @click="addExpense()" class="btn--success" style="width:30%;padding:.5em;">Add expense</button>
                <button @click="clear()" style="width:30%;padding:.5em;">Clear</button>
            </div>
        </form>
        <div style="width:45%;margin-left:2.49%;display:inline-block;vertical-align:top;" >
            <div style="padding:.5em;" v-if="expenses.length > 0">
                <div class="container" style='max-height:400px;overflow-y:auto;'>
                    <div v-for="expense in expenses" style="margin:1em auto;">
                        <b>[ {{ ParseDate(expense.date) }} ] {{expense.name}}  </b><br/>
                        <p style="text-align:right;">${{ ParseNumber(expense.amount) }}</p>
                        <button @click="deleteExpense(expense)" style="color:red;">Eliminar</button>
                        <hr>
                    </div>
                </div>
                <div style="text-align:right;color:red;">
                    <b>Total: ${{ ParseNumber(TotalExpenses) }}</b>
                </div>
            </div>
            <div v-else>
                <h3>You dont have any expense registered yet 👀</h3>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"expenses",
    data:()=>
    {
        return {
            expense_name:"",
            expense_amount:0,
            expense_date:new Date().toISOString().substr(0,10),
            expense_today:false,
            expenses:[]
        };
    },
    methods:{
        addExpense(){
            let ExpenseItem = {
                name:"",
                amount:0,
                date:""
            };

            ExpenseItem.name = this.expense_name;
            ExpenseItem.amount = this.expense_amount || 0;
            ExpenseItem.date = this.expense_date;
            
            let ExpensesRows = window.localStorage.getItem('expenses');

            if(ExpensesRows)
                ExpensesRows = JSON.parse(ExpensesRows);
            else
                ExpensesRows = new Array();

            ExpensesRows.push(ExpenseItem);

            window.localStorage.setItem('expenses', JSON.stringify(ExpensesRows));

            this.expenses.push(ExpenseItem);
            this.clear();

        },
        clear(){
            this.expense_name = "";
            this.expense_amount = 0;
            this.expense_date = new Date().toISOString().substr(0,10)
        },
        fetchExpenses(){
            let ExpensesRows = window.localStorage.getItem('expenses');

            if(ExpensesRows){
                this.expenses = JSON.parse(ExpensesRows);
            }
        },
        ParseDate(date){
            let [year,month,day] = date.split("-");

            let Months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

            return Months[parseInt(month)-1]+ " " + day + ", " + year;
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
