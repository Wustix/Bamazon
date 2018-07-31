var mysql = require("mysql");
var inquirer = require("inquirer");

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
        ]).then(function (answer) {

            var query = "SELECT * FROM Products WHERE itemID = " + answer.Product;

            connection.query(query, function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    if (answer.Quantity < res[i].stockquantity) {
                        console.log("Great, we have enough stuff!!")

                    }


                    else {
                        console.log("Not enough items in stock!");
                    }
                }

            })
            return answer;

        }).then(function (answer) {
            for (var i = 0; i < res.length; i++) {
                if (answer.Quantity) {
                    var newQuantity = res[i].stockquantity - answer.Quantity;
                    var product = answer.Product;
                    var totalCost = (answer.Quantity * res[i].price);
                }
                else {
                    console.log(Quantity);
                    connection.end();
                }
                connection.query("UPDATE products SET stockquantity= ? WHERE itemID= ?", [newQuantity, product], function (err, res) {

                    if (err) throw err;
                    console.log("Your total is $" + totalCost);
                    connection.end();

                })
            }




        })
}






