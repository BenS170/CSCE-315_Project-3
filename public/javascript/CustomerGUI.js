
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

/**
 * Creates an HTML table of entrees given data read in from SQL database
 * @author Anoop Braich
 * @param {Array} data - this array contains information about menu items stored in the database
 * @returns {String} - a string containing the HTML for a table with rows of entree menu items and their respective information
 */
function makeEntreeTable(data){
    var htmlStr = '<table id="entreeTable" style="border:none";>';
  
    for (let i = 0; i < data.result.length; i++){

        if (i%3 == 0){
            htmlStr += '<tr>'
        }

        htmlStr += '<td style = "height:50%;"><div>'

        var itemName = data.result[i].item_name;
        htmlStr += '<h2>' + itemName + '</h2>';

        var itemImg = "<img src = '"+data.result[i].image_url+"' style='width:220px;height:185px;'>";
        htmlStr += itemImg;

        var itemPrice = data.result[i].item_price;
        htmlStr += '<h2>' + "$" + Number(itemPrice).toFixed(2) + '</h2>';
        
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

    /**
     * an object representing the viewEntreesButton in the Customer GUI. The associated event listener function will trigger when clicked. 
     * Once the event listener is triggered the menu items with type entree will be displayed for the customer.
     * @type {HTML}
     */
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
  
  
/**
 * Creates an HTML table of sides given data read in from SQL database
 * @author Anoop Braich
 * @param {Array} data - this array contains information about menu items stored in the database
 * @returns {String} - a string containing the HTML for a table with rows of side menu items and their respective information
 */
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
        htmlStr += '<h2>' + "$" + Number(itemPrice).toFixed(2) + '</h2>';

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
  
    /**
     * an object representing the viewSidesButton in the Customer GUI. The associated event listener function will trigger when clicked. 
     * Once the event listener is triggered the menu items with type side will be displayed for the customer.
     * @type {HTML}
     */
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
  
/**
 * Creates an HTML table of drinks given data read in from SQL database
 * @author Anoop Braich
 * @param {Array} data - this array contains information about menu items stored in the database
 * @returns {String} - a string containing the HTML for a table with rows of drink menu items and their respective information
 */
function makeDrinkTable(data){
  
    var htmlStr = '<table id="entreeTable" style="border:none";>';
    for (let i = 0; i < data.result.length; i++){

    
            if (i%3 == 0){
                htmlStr += '<tr>'
            }
    
            htmlStr += '<td><div>'
    
            var itemName = data.result[i].item_name;
            htmlStr += '<h2>' + itemName + '</h2>';
            
            var itemImg = "";
            if(itemName == 'Bottled Diet Coke' || itemName == 'Bottled Coke'){
                itemImg = "<img src = '"+data.result[i].image_url+"' style='width:75px;height:140px;'>";
            }
            else{
                itemImg = "<img src = '"+data.result[i].image_url+"' style='width:180px;height:140px;'>";
            }
            htmlStr += itemImg;
    
            var itemPrice = data.result[i].item_price;
            htmlStr += '<h2>' + "$" + Number(itemPrice).toFixed(2) + '</h2>';
    
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
  
    /**
     * an object representing the viewDrinksButton in the Customer GUI. The associated event listener function will trigger when clicked. 
     * Once the event listener is triggered the menu items with type drink will be displayed for the customer.
     * @type {HTML}
     */
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
  
  
  
/**
 * Creates an HTML table of desserts given data read in from SQL database
 * @author Anoop Braich
 * @param {Array} data - this array contains information about menu items stored in the database
 * @returns {String} - a string containing the HTML for a table with rows of dessert menu items and their respective information
 */
function makeDessertTable(data){

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
            htmlStr += '<h2>' + "$" + Number(itemPrice).toFixed(2) + '</h2>';
    
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
    
    /**
     * an object representing the viewDessertsButton in the Customer GUI. The associated event listener function will trigger when clicked. 
     * Once the event listener is triggered the menu items with type dessert will be displayed for the customer.
     * @type {HTML}
     */
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


    /**
     * an object representing the OrderButton in the Customer GUI. The associated event listener function will trigger when clicked. 
     * Once the event listener is triggered the menu items that are currently in the customer's order will be displayed for the customer.
     * @type {HTML}
     */
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

    /**
     * an object representing the CancelButton in the Customer GUI. The associated event listener function will trigger when clicked. 
     * Once the event listener is triggered, the ClearOrder function is called.
     * @type {HTML}
     */
    const CancelButton = document.getElementById("CancelButton");
    
    CancelButton.addEventListener('click', function(e) {
        console.log('cancel order was clicked');

        ClearOrder();

    });




  
  function googleTranslateElementInit(){
      new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
  }
  

/**
 * Represents the amount of rows (menu items) in the customer's order
 * @type {Number}
 */
var order_rows = 0;
/**
 * This array stores the item ID's of each menu item in the customer's order
 * @type {Array}
 */
var order_items = [];
/**
 * This array stores the name of each menu item in the customer's order
 * @type {Array}
 */
var order_name = [];
/**
 * This array stores the amount of each menu item in the customer's order
 * @type {Array}
 */
var order_quantity = [];
/**
 * This array stores the price of each menu item in the customer's order
 * @type {Array}
 */
var order_prices = [];
  


/**
 * Adds a menu item to the customer's order and provides an alert that an item has been successfully added 
 * @author Anoop Braich
 * @param {Number} menuId - The ID number of the item
 * @param {String} itemName - The name of the item
 * @param {Float} itemPrice - The price of the item 
 */
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



/**
 * Increases the quantity of a specified menu item already in the customer's order by one everytime the + is clicked
 * @author Anoop Braich
 * @param {Number} menuId - The ID number of the item to be incremented 
 */
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



/**
 * Decreases the quantity of a specified menu item already in the customer's order by one everytime the - is clicked.
 * If the quantity reaches 0, the menu item and corresponding row will be removed from the customer's order order summary, respectively.
 * @author Anoop Braich
 * @param {Number} menuId - The ID number of the item to be decremented 
 */
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
// Was used when we had a delete from order button, now the decrement button is used

// function deleteFromOrder(menuId, itemName, itemPrice){
//     console.log('delete from order was clicked');

//     console.log('quantity array is:')
//     for(var i = 0; i < order_quantity.length; i++) {
//         console.log(order_quantity[i]);
//     }
//     console.log('end q array');


//     if(order_items.includes(menuId)) {
//         var ind = order_items.indexOf(menuId);

//         // if quantity is > 1, decrement quantity by 1
        
//         if(order_quantity[ind] > 1){
//             console.log('in if');
//             order_quantity[ind]--;
//         }

//         // else if quantity is <= 1, remove id, name, and price from respective arrays
//         else {
//             console.log('in else!');
//             var ind = order_items.indexOf(menuId);
//             // var del_id = document.getElementById(menuId);
//             // var del_name = document.getElementById(itemName);
//             // var del_price = document.getElementById(itemPrice);
//             console.log(menuId);
//             console.log(itemName);
//             console.log(itemPrice);
//             // order_id.splice(del_id, 1);
//             // order_name.splice(del_name, 1);
//             // order_price.splice(del_price, 1);
//             order_items.splice(ind, 1);
//             order_name.splice(ind, 1);
//             order_prices.splice(ind, 1);
//             // need to replace the 1 quantity value with a 0 now 
//             // logic: if quantity is 0, then delete that row from the table...
//             // get element by id...?
//             //order_quantity.splice(ind, 1, 0);
//         }

//         console.log('quantity array is:')
//         for(var i = 0; i < order_quantity.length; i++) {
//             console.log(order_quantity[i]);
//         }
//         console.log('end q array');
        
//     }

//     else {
//         console.log('Cannot delete an item not in the order!');
//     }

// }


/**
 * Creates and updates the order summary table after a new menu item is added, incremented, decremented, or fully deleted from the customer's order.
 * @author Anoop Braich
 */
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
        htmlstring = htmlstring + "<td style = \"border:none;\"><button class = 'increment-and-decrement-qty' onclick=\"decrement('"+order_items[i]+"')\">-</button></td>"; 
        htmlstring = htmlstring + '<td value=1 style = "border:none;">' + order_quantity[i] + '</td>';
        htmlstring = htmlstring + "<td style = \"border:none;\"><button class = 'increment-and-decrement-qty' onclick=\"increment('"+order_items[i]+"')\">+</button></td>"; 
        htmlstring = htmlstring + '<td style = "border:none;">' + Number(order_prices[i] * order_quantity[i]).toFixed(2) + '</td></tr>';

        // htmlstring = htmlstring + '<tr><td>' + order_name[i] + '</td>';
        // htmlstring = htmlstring + '<td>' + order_quantity[i] + '</td>';
        // htmlstring = htmlstring + '<td>' + order_prices[i] * order_quantity[i] + '</td></tr>';

       
    }

    htmlstring = htmlstring + "</table>";
    OrderTable.innerHTML = htmlstring;

}



// total and tax calculations are redundant, can prolly pass in tax to total to make it less code or combine into 1 function

/**
 * Calculates the total price of the menu items in the customer's order and the associated tax.
 * Then calculates the final price which is the total price plus the tax. 
 * Displays the calculations under the order summary
 * @author Anoop Braich
 */

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



/**
 * Clears all global arrays, resets the order summary table, and resets total and tax calculations.
 * @author Anoop Braich
 */
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



// submit order interacts directly with the database, will need to do a post function in the app.js to input order in orders table

/**
 * an object representing the SubmitButton in the Customer GUI. The associated event listener function will trigger when clicked. 
 * Once the event listener is triggered the menu items in the customer's order will be submitted to the database as an order if there is at least one item in the order.
 * Note: Acutal functionality of this is located in the function named SubmitOrderLogic
 * @type {HTML}
 */
const button = document.getElementById("SubmitButton");
button.addEventListener('click', function(e) {

    if(order_items.length > 0) {
        submitOrderLogic();
    }

    else {
        const emptyOrder = alert("Cannot place an empty order!");
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



/**
 * Initializes the Google Maps API to enable the manager to view the location of Rev's American Grill
 */
 function initMap() {
    // The location of Rev's
    const revs = { lat: 30.612674885055362, lng: -96.3407095157521 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: revs,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: revs,
        map: map,
    });
}
  
    window.initMap = initMap;
