var mysql = require("mysql");
var inquirer = require("inquirer");
var cliTable = require("cli-table");
var colors = require("colors");

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
        var table = new cliTable({
            head: ["Item Number".cyan, "Product Name".cyan, "Department".cyan, "Price".cyan, "Quantity".cyan],
            colWidths: [13, 20, 20, 13, 13],
        });

        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].itemID, res[i].productname, res[i].departmentname, res[i].price, res[i].stockquantity]
            );
        }

        console.log(table.toString());
        // connection.end();
        start();

    })

};

function start() {
    inquirer
        .prompt([
            {


                name: "Product",
                type: "input",
                message: "What is the ID of the product you would like to buy?",
                validate: function (value) {
                    if (isNaN(value) == false) {
                        return true;
                    }
                    return false;


                }
            },
            {
                name: "Quantity",
                type: "input",
                message: "How many units would you like to buy?",
                validate: function (value) {
                    if (isNaN(value) == false) {
                        return true;
                    }
                    return false;

                }

            }
        ])

        .then(function (answer) {
            return new Promise(function (resolve, reject) {
                // query for all items in products table where the item_id is what was chosen
                connection.query("SELECT * FROM products WHERE itemID=?", answer.Product, function (err, res) {
                    if (err) reject(err);
                    resolve(res);
                });
            }).then(function (result) {
                // if there aren't enough of the item
                if (answer.Quantity > result[0].stockquantity) {
                    return "Insufficient quantity!";
                    // if there are enough
                } else {
                    var object = {};
                    // answer is the users responses to the prompts
                    object.answer = answer;
                    // result is the results of the query
                    object.result = result;
                    return object;
                }
            }).catch(function (err) {
                console.log(err);
                connection.end();
            }).then(function (object) {
                // if there was sufficient quantity
                if (object.answer) {
                    var newQuantity = object.result[0].stockquantity - object.answer.Quantity;
                    var product = object.answer.Product;
                    var totalCost = (object.result[0].price * object.answer.Quantity).toFixed(2);
                    // query that updates the quantity of the item
                    connection.query("UPDATE products SET stockquantity=? WHERE itemID=?", [newQuantity, product], function (err, res) {
                        if (err) reject(err);
                        console.log('Your total cost is $' + totalCost);
                        // destroy connection
                        connection.end();
                    });
                } else {
                    console.log(object);
                    // destroy connection
                    connection.end();
                }
            });
        });
}