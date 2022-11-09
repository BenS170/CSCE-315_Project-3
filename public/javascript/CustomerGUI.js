
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

//     const pool = new Pool;
//     var result = pool.query("SELECT * FROM menu_items WHERE menu_id='"+ menu_id +"';");

//     let MenuID = result.parseInt("menu_id");
//     let Name = result.getString("item_name");
//     let Price = result.parseFloat("item_price");

//     let thisOrder = new OrderItem(MenuID, Name, Price);
//     order.push(thisOrder);

// }


// // delete items
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
  htmlMenuTable = htmlMenuTable + "</tr>";

  for (let i = 0; i < data.result.length; i++){

      htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_price + "</td>";
      htmlMenuTable = htmlMenuTable + "</tr>";
  }
  htmlMenuTable = htmlMenuTable + "</table>";
  return htmlMenuTable;
}


const viewEntreesButton = document.getElementById("viewEntreesButton");

viewEntreesButton.addEventListener('click', function(e) {
    console.log('view entrees was clicked');
  
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
  htmlMenuTable = htmlMenuTable + "</tr>";

  for (let i = 0; i < data.result.length; i++){

      htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_price + "</td>";
      htmlMenuTable = htmlMenuTable + "</tr>";
  }
  htmlMenuTable = htmlMenuTable + "</table>";
  return htmlMenuTable;
}


const viewSidesButton = document.getElementById("viewSidesButton");

viewSidesButton.addEventListener('click', function(e) {
    console.log('view sides was clicked');
  
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
  htmlMenuTable = htmlMenuTable + "</tr>";

  for (let i = 0; i < data.result.length; i++){

      htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_price + "</td>";
      htmlMenuTable = htmlMenuTable + "</tr>";
  }
  htmlMenuTable = htmlMenuTable + "</table>";
  return htmlMenuTable;
}


const viewDrinksButton = document.getElementById("viewDrinksButton");

viewDrinksButton.addEventListener('click', function(e) {
    console.log('view drinks was clicked');
  
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
  htmlMenuTable = htmlMenuTable + "</tr>";

  for (let i = 0; i < data.result.length; i++){

      htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
      htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_price + "</td>";
      htmlMenuTable = htmlMenuTable + "</tr>";
  }
  htmlMenuTable = htmlMenuTable + "</table>";
  return htmlMenuTable;
}


const viewDessertsButton = document.getElementById("viewDessertsButton");

viewDessertsButton.addEventListener('click', function(e) {
    console.log('view desserts was clicked');
  
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


/*
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
*/