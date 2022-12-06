

// // SQL Queries - To display type of menu item and corresponding price:

// // For Entrees: SELECT menu_id, item_name, item_price FROM menu_items WHERE type = 'entree';
// // For Sides: SELECT menu_id, item_name, item_price FROM menu_items WHERE type = 'side';
// // For Desserts: SELECT menu_id, item_name, item_price FROM menu_items WHERE type = 'dessert';
// // For Drinks: SELECT menu_id, item_name, item_price FROM menu_items WHERE type = 'drink';


// CustomerOrder.ejs

// Add Items, Remove Items
// Total Order, view price
// Cancel Order
// Submit order

function makeEntreeTable(data){
   var htmlStr = '<table id="entreeTable" style="border:none";>';
    for (let i = 0; i < data.result.length; i++){

        if (i%3 == 0){
            htmlStr += '<tr>'
        }

        htmlStr += '<td><div>'

        var itemName = data.result[i].item_name;
        htmlStr += '<h2>' + itemName + '</h2>';

        var itemImg = "<img src = '"+data.result[i].image_url+"' style='width:180px;height:140px;'>";
        htmlStr += itemImg;

        var itemPrice = data.result[i].item_price;
        htmlStr += '<h2>' + "$" + itemPrice + '</h2>';

        var orderButton = '<button class = "addToOrder" onclick = "addToOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">ADD TO ORDER</button>';
        htmlStr += orderButton;

        htmlStr += '</div></td>';

        if (i%3 == 2 || i == data.result.length-1){
            htmlStr += '</tr>'
        }
    }

    htmlStr += '</table>';

    return htmlStr;

}
  
  
  const viewEntreesButton = document.getElementById("Entrees");
  
  viewEntreesButton.addEventListener('click', function(e) {
      console.log('view entrees was clicked');

      CustomerView = document.getElementById("CustomerView");
      CustomerView.hidden = false;

      OrderButton.hidden = false;
  
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
    var htmlStr = '<table id="sideTable" style="border:none";>';
    for (let i = 0; i < data.result.length; i++){

        if (i%3 == 0){
            htmlStr += '<tr>'
        }

        htmlStr += '<td><div>'

        var itemName = data.result[i].item_name;
        htmlStr += '<h2>' + itemName + '</h2>';

        var itemImg = "<img src = '"+data.result[i].image_url+"' style='width:180px;height:140px;'>";
        htmlStr += itemImg;

        var itemPrice = data.result[i].item_price;
        htmlStr += '<h2>' +"$" + itemPrice + '</h2>';

        var orderButton = '<button class = "addToOrder" onclick = "addToOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">ADD TO ORDER</button>';
        htmlStr += orderButton;

        htmlStr += '</div></td>';

        if (i == data.result.length-1){
            htmlStr += '</tr>'
        }
    }

    htmlStr += '</table>';

    return htmlStr;
}
  
  
  const viewSidesButton = document.getElementById("Sides");
  
  viewSidesButton.addEventListener('click', function(e) {
      console.log('view sides was clicked');

      CustomerView = document.getElementById("CustomerView");
      CustomerView.hidden = false;

      OrderButton.hidden = false;
  
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
<<<<<<< HEAD
    var htmlStr = '<table id="entreeTable" style="border:none";>';
    for (let i = 0; i < data.result.length; i++){
    
            if (i%3 == 0){
                htmlStr += '<tr>'
            }
    
            htmlStr += '<td><div>'
    
            var itemName = data.result[i].item_name;
            htmlStr += '<h2>' + itemName + '</h2>';
    
            var itemImg = "<img src = '"+data.result[i].image_url+"' style='width:180px;height:140px;'>";
            htmlStr += itemImg;
    
            var itemPrice = data.result[i].item_price;
            htmlStr += '<h2>' +"$" + itemPrice + '</h2>';
    
            var orderButton = '<button class = "addToOrder" onclick = "addToOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">ADD TO ORDER</button>';
            htmlStr += orderButton;
    
            htmlStr += '</div></td>';
    
            if (i%3 == 2 || i == data.result.length-1){
                htmlStr += '</tr>'
            }
        }
    
        htmlStr += '</table>';
    
        return htmlStr;
=======
    htmlMenuTable = '<table> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Menu ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Picture</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Name</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Price</th>";
    htmlMenuTable = htmlMenuTable + "<th>Add To Order</th>";
    htmlMenuTable = htmlMenuTable + "<th>Delete From Order</th>";
    htmlMenuTable = htmlMenuTable + "</tr>";
  
    for (let i = 0; i < data.result.length; i++){
  
        htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + "<img src = '"+data.result[i].image_url+"' style='width:180px;height:140px;'>" + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + "$" +  data.result[i].item_price + "</td>";
        htmlMenuTable = htmlMenuTable + '<td><button class = "addToOrder" onclick = "addToOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">ADD TO ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + '<td><button class = "deleteFromOrder" onclick = "deleteFromOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">DELETE FROM ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + "</tr>";
    }
    htmlMenuTable = htmlMenuTable + "</table>";
    return htmlMenuTable;
>>>>>>> c66383defdc21d3dda1a7431f54237a11bd5e5a5
}
  
  
  const viewDrinksButton = document.getElementById("Drinks");
  
  viewDrinksButton.addEventListener('click', function(e) {
      console.log('view drinks was clicked');

      CustomerView = document.getElementById("CustomerView");
      CustomerView.hidden = false;

      OrderButton.hidden = false;
  
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
<<<<<<< HEAD

    var htmlStr = '<table id="entreeTable" style="border:none";>';
    for (let i = 0; i < data.result.length; i++){
    
            if (i%2 == 0){
                htmlStr += '<tr>'
            }
    
            htmlStr += '<td style="width:50%"><div>'
    
            var itemName = data.result[i].item_name;
            htmlStr += '<h2>' + itemName + '</h2>';
    
            var itemImg = "<img src = '"+data.result[i].image_url+"' style='width:180px;height:140px;'>";
            htmlStr += itemImg;
    
            var itemPrice = data.result[i].item_price;
            htmlStr += '<h2>' +"$" + itemPrice + '</h2>';
    
            var orderButton = '<button class = "addToOrder" onclick = "addToOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">ADD TO ORDER</button>';
            htmlStr += orderButton;
    
            htmlStr += '</div></td>';
    
            if (i == data.result.length-1){
                htmlStr += '</tr>'
            }
        }
    
        htmlStr += '</table>';
    
        return htmlStr;
=======
    htmlMenuTable = '<table> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Menu ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Picture</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Name</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Price</th>";
    htmlMenuTable = htmlMenuTable + "<th>Add To Order</th>";
    htmlMenuTable = htmlMenuTable + "<th>Delete From Order</th>";
  
    for (let i = 0; i < data.result.length; i++){
  
        htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + "<img src = '"+data.result[i].image_url+"' style='width:180px;height:140px;'>" + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + "$" + data.result[i].item_price + "</td>";
        htmlMenuTable = htmlMenuTable + '<td><button class = "addToOrder" onclick = "addToOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">ADD TO ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + '<td><button class = "deleteFromOrder" onclick = "deleteFromOrder('+data.result[i].menu_id+",'"+data.result[i].item_name+"',"+data.result[i].item_price+')">DELETE FROM ORDER</button></td>';
        htmlMenuTable = htmlMenuTable + "</tr>";
    }
    htmlMenuTable = htmlMenuTable + "</table>";
    return htmlMenuTable;
>>>>>>> c66383defdc21d3dda1a7431f54237a11bd5e5a5
}
  
  const viewDessertsButton = document.getElementById("Desserts");
  
  viewDessertsButton.addEventListener('click', function(e) {
      console.log('view desserts was clicked');

      CustomerView = document.getElementById("CustomerView");
      CustomerView.hidden = false;

      OrderButton.hidden = false;
      
  
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


  const OrderButton = document.getElementById("View Order");
  
  OrderButton.addEventListener('click', function(e) {
    console.log('order was clicked');

    CustomerView = document.getElementById("CustomerView");
    CustomerView.hidden = true;
    OrderButton.hidden = true;

    CustOrdTable = document.getElementById("order-summary")
    CustOrdTable.hidden = false;

    updateOrderTable();

    //calTax();
    calTotal();

  });


  const CancelButton = document.getElementById("CancelButton");
  
  CancelButton.addEventListener('click', function(e) {
      console.log('cancel order was clicked');

      ClearOrder();

  });




  
  function googleTranslateElementInit(){
      new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
  }
  
  

  

  var order_rows = 0;
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

        order_rows++;
    
    }

    // feedback for when an item has been added to an order
    const itemConfirmation = alert(itemName + " has been added to your order.");



    for(var i = 0; i < order_items.length; i++) {    
        console.log(order_items[i]);
    }
  
}


function increment(menuId){
    console.log("increment has been clicked");

    console.log("menuID: " + menuId);
    console.log("quantity array: " + order_quantity);

    // if(order_items.includes(menuId)) {

    console.log("Items array: " + order_items);

    var men_ind = 0;
    for(var i = 0; i < order_items.length; i++)
    {
        if(order_items[i] == menuId){
            men_ind = i;
        }
    }

    //var men_ind = order_items.indexOf(menuId);
    console.log("index is: " + men_ind);

    order_quantity[men_ind]++;
    console.log("updated quantity array: " + order_quantity);

    // have to update properly after incrementing 
    updateOrderTable();
    calTotal();


}


function decrement(menuId){

    console.log('decrement was clicked');

    var men_ind = 0;
    for(var i = 0; i < order_items.length; i++)
    {
        if(order_items[i] == menuId){
            men_ind = i;
        }
    }

    // if quantity is > 1, decrement quantity by 1
    if(order_quantity[men_ind] > 1){
        console.log('in if');
        order_quantity[men_ind]--;
    }

    // else if quantity is <= 1, remove id, name, and price from respective arrays
    else {
        console.log('in else!');

        order_items.splice(men_ind, 1);
        order_name.splice(men_ind, 1);
        order_prices.splice(men_ind, 1);

        //order_quantity[men_ind] = 0;
        order_quantity[men_ind]--;
        order_quantity.splice(men_ind,1);
        //^ deletes that index right here...
        order_rows--;


    }

    console.log("items array: " + order_items);
    console.log("names array: " + order_name);
    console.log("quantity array: " + order_quantity);


    // have to update properly after decrementing
    updateOrderTable();
    calTotal();

 }



  // same as decrement function essentially, can resolve differences later
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
            order_items.splice(ind, 1);
            order_name.splice(ind, 1);
            order_prices.splice(ind, 1);
            // need to replace the 1 quantity value with a 0 now 
            // logic: if quantity is 0, then delete that row from the table...
            // get element by id...?
            //order_quantity.splice(ind, 1, 0);
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
    //htmlstring = htmlstring + "<th>Item Name</th>" + "<th>Quantity</th>" + "<th>Price</th></tr>"; 
    htmlstring = htmlstring + "<th style = border:none;>Item Name</th>" + "<th style = border:none;></th>"+ "<th style = border:none;>Quantity</th>" + "<th style = border:none;></th>"+"<th style = border:none;>Price</th>" + "</tr>"; 

    

    for(var i = 0; i < order_items.length; i++) {
        if (order_quantity[i] == 0){
            console.log("The index with a value of 0 in the quantity array is: " + i);
            order_quantity.splice(i,1);
            order_items.splice(i,1);
            order_name.splice(i,1);
            order_prices.splice(i,1);
            continue;
        }

        htmlstring = htmlstring + '<td style = "border:none;">' + order_name[i] + '</td>';
        htmlstring = htmlstring + "<td style = \"border:none;\"><button onclick=\"decrement('"+order_items[i]+"')\">-</button></td>"; 
        htmlstring = htmlstring + '<td value=1 style = "border:none;">' + order_quantity[i] + '</td>';
        htmlstring = htmlstring + "<td style = \"border:none;\"><button onclick=\"increment('"+order_items[i]+"')\">+</button></td>"; 
        htmlstring = htmlstring + '<td style = "border:none;">' + Number(order_prices[i] * order_quantity[i]).toFixed(2) + '</td></tr>';

        // htmlstring = htmlstring + '<tr><td>' + order_name[i] + '</td>';
        // htmlstring = htmlstring + '<td>' + order_quantity[i] + '</td>';
        // htmlstring = htmlstring + '<td>' + order_prices[i] * order_quantity[i] + '</td></tr>';

       
    }

    htmlstring = htmlstring + "</table>";
    OrderTable.innerHTML = htmlstring;

}



  // total and tax calculations are redundant, can prolly pass in tax to total to make it less code or combine into 1 function

function calTotal(){
    var tax = 0; 
    var tot_price = 0; // total without tax
    var total = 0; // final total

    for (var t = 0; t < order_prices.length; t++) {
        tot_price += (order_prices[t] * order_quantity[t]);
    }

    console.log('total price is ' +  tot_price);

    tax = 0.0825 * tot_price;
    var total = tax + tot_price;

    tax = Number(0.0825 * tot_price).toFixed(2);

    var Tax = document.getElementById("order-tax");
    var tax_string = 'Tax: $' + tax;
    Tax.innerHTML = tax_string;

    total = Number(total).toFixed(2);

    var Total = document.getElementById("order-total");
    var tot_string = 'Total: $' + total;
    Total.innerHTML = tot_string;


    // var tax_h = document.getElementById('tax');
    // tax_h.innerHTML = Number((getTax()).toFixed(2));
    // let total = Number((parseFloat(getTax()) + parseFloat(getTotal())).toFixed(2));
    // var total_h = document.getElementById('total')
    // total_h.innerHTML = total;


}



  // clear all arrays and reset the order table 
function ClearOrder() {

    console.log('clearing table');
    var clTable = document.getElementById('CustomerOrderTable');
    for(var i = 0; i < order_rows; i++) {
        console.log(order_rows);
        console.log(typeof(clTable));
        clTable.deleteRow(1);
    }

    //clearTable.innerHTML = "";

    order_rows = 0;
    order_items = [];
    order_name = [];
    order_quantity = [];
    order_prices = [];

    console.log("After clearing: " + order_quantity);
    console.log("After clearing: " + order_items);

    //reset price and tax
    var Tax = document.getElementById("order-tax");
    var tax_string = 'Tax: $';
    Tax.innerHTML = tax_string;

    var Total = document.getElementById("order-total");
    var tot_string = 'Total: $';
    Total.innerHTML = tot_string;


}







// order_prices[]
// order_items[]

// submit order interacts directly with the database, will need to do a post function in the app.js to input order in orders table

const button = document.getElementById("SubmitButton");
button.addEventListener('click', function(e) {

    if(order_items.length > 0) {
        submitOrderLogic();
    }

    else {
        const emptyOrder = alert("Cannot sumbit an empty order!");
    }


});


function submitOrderLogic() {
    console.log('Server submit was clicked');
    const data = {order_items, order_prices, order_quantity};
  
    fetch('/customerSubmit', {
          method: 'POST',
          headers:{
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(function(response) {
        if(response.ok) {
          console.log('Click was recorded');
          ClearOrder();
  
          console.log("here");
          // can change to confirm order first then alert with order #
          var maxID;
          fetch('/getMaxID', {method: 'GET'})
          .then(function(response) {
              if(response.ok) return response.json();
              throw new Error('Request failed.');
          })
              .then(function(data) {
                  console.log(data.result);
                  maxID = data.result.max;   
                  const subConfirmation = alert("Thank you for your order!\n" + "Your Order ID is " + maxID); 
  
          })
          .catch(function(error) {
              console.log(error);
          });
  
          
  
          return;
        }
        throw new Error('Request failed.');
      })
      .catch(function(error) {
        console.log(error);
      });
  
  
}
