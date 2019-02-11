const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "personal_expenses"
})

let ExpenseModel = {};


ExpenseModel.find = (query, callback) => {
    if (connection) {

        let [year, month] = new Date().toISOString().substr(0, 7).split("-");

        let Query = {
            expense: "%%",
            month: parseInt(month),
            day: "%%",
            year: parseInt(year)
        }

        if (query) {

            if (query.expense)
                Query.expense = query.expense;

            if (query.month) {
                let [year_, month_] = query.month.split("-");

                Query.month = parseInt(month_);
                Query.year = parseInt(year_);
            }

            if (query.day)
                Query.day = parseInt(query.day);
        }

        console.log(Query);

        connection.query(`
        SELECT id, expense as name, expense_date as date, amount , location
            FROM expenses 
                WHERE YEAR(expense_date) LIKE ? AND MONTH(expense_date) LIKE ? AND DAY(expense_date) LIKE ? AND expense LIKE ?
                ORDER BY expense_date DESC, id DESC;`, [Query.year, Query.month, Query.day, Query.expense],
            (err, results) => {
                if (err) callback(err)

                callback(null, results);
            })
    }
};

ExpenseModel.insert = (payload, callback) => {
    if (connection) {

        connection.query(`
        INSERT INTO expenses(user_id, expense, expense_date, location, amount, create_time)
        VALUES(?, ?, ?, ?, ?, NOW());`, [0, payload.name, payload.date, payload.location, payload.amount], (err, result) => {
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
                    INSERT INTO expenses(user_id, expense, expense_date, location, amount, create_time)
                    VALUES(?, ?, ?, ?, ?, NOW());`, [0, payload[i].name, payload[i].date, payload[i].location, payload[i].amount], (err, result) => {
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

ExpenseModel.delete = (payload, callback) => {
    if (connection) {

        connection.query(`
            DELETE FROM expenses WHERE id LIKE ?;
        `, [payload.id], (err, result) => {
            if (err) callback(err)

            callback(null, result);
        })
    }
};


module.exports = ExpenseModel;