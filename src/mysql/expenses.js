const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "INSERTYOURREALHOSTINHERE",
    user: "INSERTYOURREALUSERINHERE",
    password: "INSERTYOURREALPASSWORDINHERE",
    database: "INSERTYOURREALDBINHERE"
})

let ExpenseModel = {};


ExpenseModel.find = (callback) => {
    if (connection) {

        connection.query("SELECT id, expense as name, expense_date as date, amount FROM expenses", (err, results) => {
            if (err) callback(err)

            callback(null, results);
        })
    }
};

ExpenseModel.insert = (payload, callback) => {
    if (connection) {

        connection.query(`
        INSERT INTO expenses(user_id, expense, expense_date, amount, create_time)
        VALUES(?, ?, ?, ?, NOW());`, [0, payload.name, payload.date, payload.amount], (err, result) => {
            if (err) callback(err)

            callback(null, result);
        })
    }
};

ExpenseModel.insertMany = (payload, callback) => {
    if (connection) {

        if (payload.length > 0) {

            let Counter = 0;
            let TotalCounter = payload.length;

            for (let i = 0; i < payload.length; i++) {
                connection.query(`
                    INSERT INTO expenses(user_id, expense, expense_date, amount, create_time)
                    VALUES(?, ?, ?, ?, NOW());`, [0, payload[i].name, payload[i].date, payload[i].amount], (err, result) => {
                    if (err) callback(err)

                    Counter++;
                })
            }

            let LoadTimer = setInterval(() => {
                if (Counter >= TotalCounter) {
                    clearInterval(LoadTimer);

                    callback(null, { message: "OK" })
                }
            })

        } else {
            callback({ message: "EMPTY" });
        }


    }
};



module.exports = ExpenseModel;