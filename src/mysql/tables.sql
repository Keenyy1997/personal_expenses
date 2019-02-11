-- DATABASE

USE personal_expenses;


-- TABLES

CREATE TABLE users(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user TEXT,
    password TEXT,
    email TEXT,
    create_time DATETIME NOT NULL,
    edit_time DATETIME,
    token TEXT,
    last_login DATETIME);

    -- USERS TABLE


CREATE TABLE expenses(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    expense TEXT,
    expense_date DATE,
    amount FLOAT,
    create_time DATETIME NOT NULL
);
    -- EXPENSES TABLE
