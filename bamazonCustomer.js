var mysql = require("mysql");
// var inquirer = require("inquirer");

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
    displayProducts();

});

var displayProducts = function () {
    var query = 'SELECT * FROM Products'
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].itemID + " || Product: " + res[i].productname + " || Department: " + res[i].departmentname + " || Price: " + res[i].price + " || Stock: " + res[i].stockquantity);
        }
        connection.end();

    })

};

