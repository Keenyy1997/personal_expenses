const express = require('express')
const Router = express.Router()
const moment = require('moment')
const mysql = require('mysql')


const Expenses = require('./mysql/expenses')


Router.get('/expenses', (req, res) => {

    let Query = req.query || req.params;

    Expenses.find(Query, (err, results) => {
        if (err) res.json(err)

        res.json({
            message: "OK",
            data: results
        })
    })
})

Router.post('/expenses', (req, res) => {

    console.log(req.body);
    Expenses.insert(req.body, (err, result) => {
        if (err) res.json(err)

        res.json({
            message: "OK",
            data: result
        })
    })
})

Router.post('/expenses_multi', (req, res) => {

    console.log(req.body);
    Expenses.insertMany(req.body, (err, result) => {
        if (err) res.json(err)

        res.json({
            message: "OK",
            data: result
        })
    })
})

Router.post('/expenses_delete', (req, res) => {

    Expenses.delete(req.body, (err, result) => {
        if (err) res.json(err)

        res.json({
            message: "OK",
            data: result
        })
    })
})

module.exports = Router;