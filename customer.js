var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  
  password: "Chw1026!",
  database: "bamazon"
});


const loadApp = () => {
  connection.connect( (err) => {
      if (err) {
          throw err;
      }

      console.log("Success! The Bamazon app is ready to shop til you drop.", connection.threadId);

      displayTable();
  });
} 

const displayTable = () => {
  connection.query("SELECT item_id, product_name, price FROM products", (err, result) => {
      if (err) {
          throw err;
      }

      let idArray = []

      result.forEach(function (index) {
          idArray.push(index.item_id);
      })

      console.log("\n");
      console.table(result);

      inputValidation(idArray);
  }); 
}


const inputValidation = (array) => {

  inquirer.prompt([
      {
          type: "input",
          message: "What would you like to buy from Bamazon? (enter ID from above table)",
          name: "whichProduct",
      },
      {
          type: "input",
          message: "How many would you like to buy?",
          name: "quantity"
      }
  ])
      .then((inqRes) => {
          if (!array.includes(parseInt(inqRes.whichProduct))) {
              console.log("Error!! Enter a valid product ID.");
              displayTable();
          } else if (!parseInt(inqRes.quantity)) {
              console.log("Error!! Enter a valid quantity.");
              displayTable();
          } else {
              inventoryManagement(inqRes);
          }
      }); 
} 

const inventoryManagement = (inqRes) => {
  const quantity = parseInt(inqRes.quantity);

  connection.query(`SELECT * FROM products WHERE item_id = ${inqRes.whichProduct}`,
      (err, result) => {

          console.log(`\nYou want ${quantity} ${result[0].product_name}`);

          const productInventory = parseInt(result[0].product_stock);
          if (err) {
              throw err;
          }

          if (quantity > productInventory) {
              console.log(`Low stock.  We only have ${productInventory} left.`);

              inquirer.prompt([
                  {
                      type: "confirm",
                      message: "Would you like to purchase them all?",
                      name: "answer",
                  }
              ]).then(function (confirm) {
                  console.log(confirm.answer);
                  if (confirm.answer == true) {
                      console.log("You have purchased all available items");
                      updateInventory(inqRes.whichProduct, productInventory, productInventory);
                  } else {
                      displayTable();
                  }
              }); 

          } else {
              console.log(`\nThat will be $${quantity * result[0].price}. \n`);

              updateInventory(inqRes.whichProduct, productInventory, quantity);
          }
      }); 
} 


const updateInventory = (productId, inventory, quantity) => {
  const updateQuant = inventory - quantity;

  connection.query(`UPDATE products SET ? WHERE ?`,
      [ {product_stock: updateQuant}, {item_id: productId} ],
      (err, result) => {
          if (err) {
              throw err;
          }

          inquirer.prompt([
              {
                  type: "confirm",
                  message: "Would you like to keep shopping?",
                  name: "answer",
              }
          ]).then(function (confirm) {
              if (confirm.answer == true) {
                  displayTable();
              } else {
                  console.log("\nThanks for shopping with Bamazon.")
                  connection.end();
              }
          }); 

      }); 
}

loadApp();