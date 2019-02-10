<template id="bills" ref="bills">
    <div class="container">
        <h1>Bills</h1>
    </div>
</template>
<script>
export default {
    name:"bills",
    data:()=>
    {
        return {

        };
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
