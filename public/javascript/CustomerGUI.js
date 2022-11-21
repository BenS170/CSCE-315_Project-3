
// // Potential Functions...

// class OrderItem {
//     constructor(menu_id, name, price) {
//         this.menu_id = menu_id;
//         this.name = name;
//         this.price = price;
//     }
// }

// var order = []; 

// // add items
// async function addItem() {
//     var menu_id = prompt("Enter the menu ID: ");


//     let MenuID = result.parseInt("menu_id");
//     let Name = result.getString("item_name");
//     let Price = result.parseFloat("item_price");

//     let thisOrder = new OrderItem(MenuID, Name, Price);
//     order.push(thisOrder);

// }

// delete items from the order
// async function deleteItem() {

//     if(orders.length() == 0) {
//         return;
//     }

//     var menu_id = prompt("Enter the menu ID: ");
//     let MenuID = parseInt("menu_id");

//     let thisOrder = new OrderItem();

//     for(var i = 0; i < orders.length(); i++) {

//         thisOrder = orders[i];

//         if(thisOrder.menu_id == menu_id) {
//             orders.splice(i, 1);
//         }
        
//     }

// }




// // submit order
// async function submitOrder() {

//     const pool = new Pool;
//     var orderID = pool.query("SELECT MAX(order_id) FROM orders;");
//     var order_ID = parseInt(orderID);
//     order_ID += 1;

//     // NOTE: HARDCODED
//     let date = "2022-11-06";
//     let day = "U";

//     let thisOrder = new OrderItem();

//     for(var i = 0; i < order.length(); i++) {

//         thisOrder = order[i];
//         pool.query("INSERT INTO orders (order_id, order_total, item, date_made, day_made) VALUES("+order_ID+", "+thisOrder.price()+", "+thisOrder.menu_id()+", '"+date+"', '"+day+"');")

//     }

//     orders.splice(0, orders.length());

// }

// // cancel order
// async function cancelOrder() {
//     var u_sure = confirm("Are you sure you want to cancel the order?");

//     if(!u_sure) {
//         return;
//     }

//     orders.splice(0, orders.length());
// }


// // Total Price Calculation
// async function totalOrderPrice() {

//     var totalPrice = 0;

//     let thisOrder = new OrderItem();
//     for(var i = 0; i < order.length(); i++) {
//         totalPrice += thisOrder.price;
//     }

//     totalPrice = Math.round((totalPrice * 1.0825) * 100) / 100;

//     console.log("Your total is: " + totalPrice);
// }


// // Viewing menu, by types?

// // SQL Queries - To display type of menu item and corresponding price:

// // For Entrees: SELECT menu_id, item_name, item_price FROM menu_items WHERE type = 'entree';
// // For Sides: SELECT menu_id, item_name, item_price FROM menu_items WHERE type = 'side';
// // For Desserts: SELECT menu_id, item_name, item_price FROM menu_items WHERE type = 'dessert';
// // For Drinks: SELECT menu_id, item_name, item_price FROM menu_items WHERE type = 'drink';


// // inventory functions
// async function viewInventory(){
//     alert("view inventory");
//     var inventoryWindow = window.open('','View Inventory');
//     inventoryWindow.document.open();
//     try {
//         const results = await client.query("select * from inventory");
//         inventoryWindow.document.write('<html><body onload="window.print()">'+ results.innerHTML + '</body></html>');
//         inventoryWindow.document.close();
//         setTimeout(function(){inventoryWindow.close();}, 100)
//         return results.rows;
//     }catch (e){
//         return [];
//     }

// }

// CustomerOrder.ejs

// Add Items, Remove Items
// Total Order, view price
// Cancel Order
// Submit order

function makeEntreeTable(data){
    htmlMenuTable = '<table> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Menu ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Name</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Price</th>";
    htmlMenuTable = htmlMenuTable + "<th>Add To Order</th>";
    htmlMenuTable = htmlMenuTable + "<th>Delete From Order</th>";
    htmlMenuTable = htmlMenuTable + "</tr>";
  
    for (let i = 0; i < data.result.length; i++){
  
        htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + "$" + data.result[i].item_price + "</td>";
        htmlMenuTable = htmlMenuTable + '<td><button class = "addToOrder" onclick = "addToOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">ADD TO ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + '<td><button class = "deleteFromOrder" onclick = "deleteFromOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">DELETE FROM ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + "</tr>";
    }
    htmlMenuTable = htmlMenuTable + "</table>";
    return htmlMenuTable;
  }
  
  
  const viewEntreesButton = document.getElementById("viewEntreesButton");
  
  viewEntreesButton.addEventListener('click', function(e) {
      console.log('view entrees was clicked');

      CustomerView = document.getElementById("CustomerView");
      CustomerView.hidden = false;
  
      CustOrdTable = document.getElementById("order-summary")
      CustOrdTable.hidden = true;
    
      fetch('/getEntree', {method: 'GET'})
          .then(function(response) {
              if(response.ok) return response.json();
              throw new Error('Request failed.');
          })
              .then(function(data) {
              // TODO: Modify HTML using the information received from the database
              content = document.getElementById("CustomerView");
              htmlMenuTable = makeEntreeTable(data);
              content.innerHTML = htmlMenuTable;
  
              console.log(data.result);
          })
          .catch(function(error) {
              console.log(error);
      });
  });
  
  
  
  function makeSideTable(data){
    htmlMenuTable = '<table> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Menu ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Name</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Price</th>";
    htmlMenuTable = htmlMenuTable + "<th>Add To Order</th>";
    htmlMenuTable = htmlMenuTable + "<th>Delete From Order</th>";
    htmlMenuTable = htmlMenuTable + "</tr>";
  
    for (let i = 0; i < data.result.length; i++){
  
        htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + "$" + data.result[i].item_price + "</td>";
        htmlMenuTable = htmlMenuTable + '<td><button class = "addToOrder" onclick = "addToOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">ADD TO ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + '<td><button class = "deleteFromOrder" onclick = "deleteFromOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">DELETE FROM ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + "</tr>";
    }
    htmlMenuTable = htmlMenuTable + "</table>";
    return htmlMenuTable;
  }
  
  
  const viewSidesButton = document.getElementById("viewSidesButton");
  
  viewSidesButton.addEventListener('click', function(e) {
      console.log('view sides was clicked');

      CustomerView = document.getElementById("CustomerView");
      CustomerView.hidden = false;
  
      CustOrdTable = document.getElementById("order-summary")
      CustOrdTable.hidden = true;
    
      fetch('/getSide', {method: 'GET'})
          .then(function(response) {
              if(response.ok) return response.json();
              throw new Error('Request failed.');
          })
              .then(function(data) {
              // TODO: Modify HTML using the information received from the database
              content = document.getElementById("CustomerView");
              htmlMenuTable = makeSideTable(data);
              content.innerHTML = htmlMenuTable;
  
              console.log(data.result);
          })
          .catch(function(error) {
              console.log(error);
      });
  });
  
  
  
  
  function makeDrinkTable(data){
    htmlMenuTable = '<table> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Menu ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Name</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Price</th>";
    htmlMenuTable = htmlMenuTable + "<th>Add To Order</th>";
    htmlMenuTable = htmlMenuTable + "<th>Delete From Order</th>";
    htmlMenuTable = htmlMenuTable + "</tr>";
  
    for (let i = 0; i < data.result.length; i++){
  
        htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + "$" +  data.result[i].item_price + "</td>";
        htmlMenuTable = htmlMenuTable + '<td><button class = "addToOrder" onclick = "addToOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">ADD TO ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + '<td><button class = "deleteFromOrder" onclick = "deleteFromOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">DELETE FROM ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + "</tr>";
    }
    htmlMenuTable = htmlMenuTable + "</table>";
    return htmlMenuTable;
  }
  
  
  const viewDrinksButton = document.getElementById("viewDrinksButton");
  
  viewDrinksButton.addEventListener('click', function(e) {
      console.log('view drinks was clicked');

      CustomerView = document.getElementById("CustomerView");
      CustomerView.hidden = false;
  
      CustOrdTable = document.getElementById("order-summary")
      CustOrdTable.hidden = true;
    
      fetch('/getDrink', {method: 'GET'})
          .then(function(response) {
              if(response.ok) return response.json();
              throw new Error('Request failed.');
          })
              .then(function(data) {
              // TODO: Modify HTML using the information received from the database
              content = document.getElementById("CustomerView");
              htmlMenuTable = makeDrinkTable(data);
              content.innerHTML = htmlMenuTable;
  
              console.log(data.result);
          })
          .catch(function(error) {
              console.log(error);
      });
  });
  
  
  
  
  function makeDessertTable(data){
    htmlMenuTable = '<table> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Menu ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Name</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Price</th>";
    htmlMenuTable = htmlMenuTable + "<th>Add To Order</th>";
    htmlMenuTable = htmlMenuTable + "<th>Delete From Order</th>";
  
    for (let i = 0; i < data.result.length; i++){
  
        htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + "$" + data.result[i].item_price + "</td>";
        htmlMenuTable = htmlMenuTable + '<td><button class = "addToOrder" onclick = "addToOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">ADD TO ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + '<td><button class = "deleteFromOrder" onclick = "deleteFromOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">DELETE FROM ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + "</tr>";
    }
    htmlMenuTable = htmlMenuTable + "</table>";
    return htmlMenuTable;
  }
  
  
  const viewDessertsButton = document.getElementById("viewDessertsButton");
  
  viewDessertsButton.addEventListener('click', function(e) {
      console.log('view desserts was clicked');

      CustomerView = document.getElementById("CustomerView");
      CustomerView.hidden = false;
  
      CustOrdTable = document.getElementById("order-summary")
      CustOrdTable.hidden = true;
    
      fetch('/getDessert', {method: 'GET'})
          .then(function(response) {
              if(response.ok) return response.json();
              throw new Error('Request failed.');
          })
              .then(function(data) {
              // TODO: Modify HTML using the information received from the database
              content = document.getElementById("CustomerView");
              htmlMenuTable = makeDessertTable(data);
              content.innerHTML = htmlMenuTable;
  
              console.log(data.result);
          })
          .catch(function(error) {
              console.log(error);
      });
  });


  const OrderButton = document.getElementById("OrderButton");
  
  OrderButton.addEventListener('click', function(e) {
      console.log('order was clicked');

    CustomerView = document.getElementById("CustomerView");
    CustomerView.hidden = true;

    CustOrdTable = document.getElementById("order-summary")
    CustOrdTable.hidden = false;

    updateOrderTable();

    //calTax();
    calTotal();

  });


  const CancelButton = document.getElementById("CancelButton");
  
  CancelButton.addEventListener('click', function(e) {
      console.log('cancel order was clicked');

      cancelOrder();

  });




  
  function googleTranslateElementInit(){
      new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
  }
  
  
  
  // need??
  // how to implement...
  
  // class OrderItem {
  //     constructor(menu_id, name, price) {
  //         this.menu_id = menu_id;
  //         this.name = name;
  //         this.price = price;
  //     }
  // };
  

  
  var order_items = [];
  var order_name = [];
  var order_quantity = [];
  var order_prices = [];
  
  
  function addToOrder(menuId, itemName, itemPrice){
      console.log('add to order was clicked');
  
      console.log(menuId);
      console.log(itemName);
      console.log(itemPrice); 

      if(order_items.includes(menuId)) {
        var ind = order_items.indexOf(menuId);
        order_quantity[ind]++;
      }

      else {
        order_items.push(menuId);
        order_name.push(itemName);
        order_prices.push(itemPrice);
        order_quantity.push(1);
        
      }
  
      for(var i = 0; i < order_items.length; i++) {    
          console.log(order_items[i]);
      }
  
  }

  // does not work 100%...
  function deleteFromOrder(menuId, itemName, itemPrice){
    console.log('delete from order was clicked');

    console.log('quantity array is:')
    for(var i = 0; i < order_quantity.length; i++) {
        console.log(order_quantity[i]);
    }
    console.log('end q array');


    if(order_items.includes(menuId)) {
        var ind = order_items.indexOf(menuId);

        // if quantity is > 1, decrement quantity by 1
        
        if(order_quantity[ind] > 1){
            console.log('in if');
            order_quantity[ind]--;
        }

        // else if quantity is <= 1, remove id, name, and price from respective arrays
        else {
            console.log('in else!');
            var ind = order_items.indexOf(menuId);
            // var del_id = document.getElementById(menuId);
            // var del_name = document.getElementById(itemName);
            // var del_price = document.getElementById(itemPrice);
            console.log(menuId);
            console.log(itemName);
            console.log(itemPrice);
            // order_id.splice(del_id, 1);
            // order_name.splice(del_name, 1);
            // order_price.splice(del_price, 1);
            order_items.splice(menuId, 1);
            order_name.splice(itemName, 1);
            order_prices.splice(itemPrice, 1);
            // need to replace the 1 quantity value with a 0 now 
            // logic: if quantity is 0, then delete that row from the table...
            // get element by id...?
            order_quantity.splice(ind, 1, 0);
        }

        console.log('quantity array is:')
        for(var i = 0; i < order_quantity.length; i++) {
            console.log(order_quantity[i]);
        }
        console.log('end q array');
        
    }

    else {
        console.log('Cannot delete an item not in the order!');
    }

  }


  function updateOrderTable(){

    var OrderTable = document.getElementById("CustomerOrderTable");
    var htmlstring = '<table><tr id = "titleRow">';
    htmlstring = htmlstring + "<th>Item Name</th>" + "<th>Quantity</th>" + "<th>Price</th></tr>"; 


    for(var i = 0; i < order_items.length; i++) {
        htmlstring = htmlstring + '<tr><td>' + order_name[i] + '</td>';
        htmlstring = htmlstring + '<td>' + order_quantity[i] + '</td>';
        htmlstring = htmlstring + '<td>' + order_prices[i] * order_quantity[i] + '</td></tr>';
       
    }

    htmlstring = htmlstring + "</table>";
    OrderTable.innerHTML = htmlstring;

  }


  // total and tax calculations are redundant, can prolly pass in tax to total to make it less code or combine into 1 function

//   function calTax(tot_price){
//     var tax = 0; 
//     var tot_price = 0;

//     for (var t = 0; t < order_price.length; t++) {
//         tot_price += order_price[t] * order_quantity[t];
//     }

//     var Tax = document.getElementById("order-tax");

//     tax = 0.0825 * tot_price;
//     var tax_string = 'Tax: $' + tax;
//     Tax.innerHTML = tax_string;


//   }


  // total price calculation is wrong?
  function calTotal(){
    var tax = 0; 
    var tot_price = 0; // total without tax
    var total = 0; // final total

    for (var t = 0; t < order_prices.length; t++) {
        tot_price += (order_prices[t] * order_quantity[t]);
    }

    console.log('total price is ' +  tot_price);

    tax = 0.0825 * tot_price;

    var Tax = document.getElementById("order-tax");
    var tax_string = 'Tax: $' + tax;
    Tax.innerHTML = tax_string;
    

    var total = tax + tot_price;

    var Total = document.getElementById("order-total");
    var tot_string = 'Total: $' + total;
    Total.innerHTML = tot_string;


  }




  
  // clear all arrays
  function cancelOrder() {

    order_items = [];
    order_name = []
    order_quantity = [];
    order_prices = [];

    console.log('clearing table');
    var clearTable = document.getElementById("CustomerOrderTable")
    clearTable.innerHTML = "";

    //reset price and tax
    

  }


// order_prices[]
// order_items[]

// submit order interacts directly with the database, will need to do a post function in the app.js to input order in orders table

const button = document.getElementById("SubmitButton");
button.addEventListener('click', function(e) {
  console.log('Server submit was clicked');
  const data = {order_items, order_prices};

  fetch('/serverSubmit', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(function(response) {
      if(response.ok) {
        console.log('Click was recorded');
        cancelOrder();
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});








// Add Items, Remove Items
// Total Order, view price
// Cancel Order
// Submit order
