var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Otis13jhawkhalo",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    // if connection is successful
    
    connection.query("SELECT * FROM products", function (err, result) {
        // if any error while executing above query, throw error
        if (err) throw err;
        // if there is no error, you have the result
        console.log(result);
        connection.end();

    });
});