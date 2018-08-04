//Module to load passwords from .env file.
require("dotenv").config();

//Modules to use DB and ask the user for instructions.
var mysql = require("mysql");
var inq = require("inquirer");

var connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USR,
  password: process.env.PASS,
  database: process.env.DB
});


connection.connect(function(err) {
  if (err) throw err;
  // console.log("Connected as: " + connection.threadId + "\n");
  start();
});

function start() {
  var query = "SELECT id, product_name, price FROM products;"
  connection.query(query, function(err, result) {
    console.log("WELCOME TO BAMAZON.COM - The Best Retro CLI Store.\nPRODUCTS FOR SALE:");
    for (var i = 0 in result) {
      console.log("ID: " + result[i].id,
        " || Prodcut: " + result[i].product_name,
        " || Price: " + result[i].price);
    }
    inq.prompt([{
      name: "ans1",
      type: "list",
      message: "Would you like to buy something?",
      choices: ["Yes", "No"],
      default: "Yes"
    }]).then(function(a) {
      if (a.ans1 === "Yes") {
        cart();
      } else {
        //Clears text from terminal.
        console.log('\033[2J');
        console.log("Thank you for visiting us. Hope to see you soon!\nBAMAZON.COM - The Best Retro CLI Store.");
        connection.end();
      }
    })
  });
};

function cart() {
  inq.prompt([{
      name: "p_id",
      type: "input",
      message: "Please enter the ID of the produt you would like to acquire: "
    },
    {
      name: "quant",
      type: "input",
      message: "Please enter the quantity of products you would like to acquire: "
    }
  ]).then(function(a) {
    console.log('\033[2J');
    console.log("Your order is being processed. Please wait...\n\n");
    connection.query(
      "SELECT stock_quantity, product_name, price FROM products WHERE ?", {
        id: a.p_id
      },
      function(err, result) {
        var stock = result[0].stock_quantity;
        var product = result[0].product_name;
        var price = result[0].price;
        var quant = a.quant;
        var id = a.p_id;

        checkout(stock, product, price, quant, id);
      });
  });
};

function checkout(stock, product, price, quant, id) {
  if (quant < stock) {
    var total = price * quant;
    console.log("Your order is ready for being processed\nThe Total is:\nQuantity: ", +quant + " || Prodcut: " + product + " || Price: " + price,
      " || TOTAL: " + total);

    inq.prompt([{
      name: "ans1",
      type: "list",
      message: "Would you like to submit the order?",
      choices: ["Yes", "No"],
      default: "Yes"
    }]).then(function(a) {
      if (a.ans1 === "Yes") {
        var newStock = stock - quant;
        connection.query(
            "UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
              },
              {
                id: id
              }
            ]
          ),
          function(err) {
            if (err) throw err;

          }
        console.log("Your order was succesfully placed.\nAllow 3 to 5 days to receive your items.");
        connection.end();
      }
    });

  } else {
    console.log("Order Cancelled.\nHave a nice day.");
  }
};
