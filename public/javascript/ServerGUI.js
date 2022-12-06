
var order_rows = 0;
var order_items = [];
var order_prices = [];

/**
 * Adds a menu item to the order summary.
 * @function
 * @param {Number} itemid - The id of the item in the database.
 * @param {string} name - name of the item.
 * @param {Number} qty - current qty of the item
 * @param {Float} price - The set price of the item in the database
 */
function addToOrder(itemid, name, qty, price){

    if(order_items.includes(itemid)){
        incQty(itemid, price);
        return;
    }

    order_items.push(itemid);
    order_prices.push(price);

    order_rows++;

    var inc = document.createElement('input');
    inc.type = "button";
    inc.id = "increment";
    inc.value = "+";
    inc.onclick = function(){
        incQty(itemid, price);
    };

    var dec = document.createElement('input');
    dec.type = "button";
    dec.id = "decrement";
    dec.value = "-";
    dec.onclick = function(){
        decQty(itemid, price);
    };

    var table = document.getElementById('orderTable');
    var row = table.insertRow(1);
    row.id = itemid;
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = name;
    cell2.appendChild(dec);
    cell3.value = qty;
    cell3.textContent = qty;
    cell4.appendChild(inc);
    cell5.value = price;
    cell5.textContent = price;

    var tax_h = document.getElementById('tax');
    tax_h.innerHTML = Number((getTax()).toFixed(2));
    let total = Number((parseFloat(getTax()) + parseFloat(getTotal())).toFixed(2));
    var total_h = document.getElementById('total')
    total_h.innerHTML = total;

}

/**
 * Increments the item that corresponds with itemid in the order by 1.
 * It also increases the price by adding the price associated with the itemid.
 * @function
 * @param {Number} itemid - The id of the item in the database.
 * @param {Float} price - The set price of the item in the database
 */
function incQty(itemid, price){
    order_items.push(itemid);
    order_prices.push(price);

    var table = document.getElementById('orderTable');
    for(var i = 1; i<table.rows.length; i++){
        var row = table.getElementsByTagName('tr')[i];
        if(row.id == itemid){
            //increasing quantity
            var cell = row.cells[2];
            cell.value = String(Number(cell.value) + 1);
            cell.textContent = cell.value;

            //increasing price
            cell = row.cells[4];
            cell.value = Number((parseFloat(cell.value) + parseFloat(price)).toFixed(2));
            cell.textContent = cell.value;
        }
    }
    

    var tax_h = document.getElementById('tax');
    tax_h.innerHTML = Number((getTax()).toFixed(2));
    let total = Number((parseFloat(getTax()) + parseFloat(getTotal())).toFixed(2));
    var total_h = document.getElementById('total')
    total_h.innerHTML = total;
    
}

/**
 * Decrements the item that corresponds with itemid in the order by 1.
 * If quantity = 0, removes the item from the order summary.
 * It also decreases the price by adding the price associated with the itemid.
 * @function
 * @param {Number} itemid - The id of the item in the database.
 * @param {Float} price - The set price of the item in the database
 */
function decQty(itemid, price){
    order_items.splice(order_items.indexOf(itemid), 1);
    order_prices.splice(order_prices.indexOf(price), 1);
    
    var table = document.getElementById('orderTable');
    for(var i = 1; i<table.rows.length; i++){
        var row = table.getElementsByTagName('tr')[i];
        if(row.id == itemid){
            //decreasing quantity
            var cell = row.cells[2];
            cell.value = String(Number(cell.value) - 1);
            cell.textContent = cell.value;

            if(cell.innerHTML == '0' || cell.innerHTML == 'NaN'){
                table.deleteRow(i);
                order_rows--;
            }

            //decreasing price
            cell = row.cells[4];
            cell.value = Number((parseFloat(cell.value) - parseFloat(price)).toFixed(2));
            cell.textContent = cell.value;
        }
    }

    var tax_h = document.getElementById('tax');
    tax_h.innerHTML = Number((getTax()).toFixed(2));
    let total = Number((parseFloat(getTax()) + parseFloat(getTotal())).toFixed(2));
    var total_h = document.getElementById('total');
    total_h.innerHTML = total;
    
}

/**
 * Clears everything in the order summary by removing every item in both the HTML
 * and the Nodejs variables.
 * @function
 */
function clearOrder(){
    var table = document.getElementById('orderTable');
    for(let i = 0; i<order_rows; i++){
        table.deleteRow(1);
    }

    order_rows = 0;
    order_items = [];
    order_prices = [];

    var tax_h = document.getElementById('tax');
    tax_h.innerHTML = getTax();
    var total = getTax() + getTotal();
    var total_h = document.getElementById('total');
    total_h.innerHTML = total;
}

/**
 * Returns the total price of all items in the order summary.
 * @function
 */
function getTotal(){
    let total = 0;
    for(let i = 0; i<order_prices.length; i++){
        total += parseFloat(order_prices[i]);
    }
    return total;
}

/**
 * Returns the sales tax of the total items in the order summary.
 * @function
 */
function getTax(){
    let tax = parseFloat(getTotal());
    tax = tax * .0825;
    return tax;
}

//This is for database

const button = document.getElementById("serverSubmit");
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
        clearOrder();
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

/**
 * Google Tranlate API element that allows for changing languages in
 * the website.
 * @function
 */
function googleTranslateElementInit(){
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}


fetch('/getMenu', {method: 'GET'})
    .then(function(response) {
        if(response.ok) return response.json();
        throw new Error('Request failed.');
    })
        .then(function(data) {
        // TODO: Modify HTML using the information received from the database
        populateGUI(data.result);
    })
    .catch(function(error) {
        console.log(error);
});

/**
 * Populates the GUI with all menu items currently listed in the database includuing
 * entrees, sides, drinks, and desserts.
 * @function
 * @param {Array} menu_items - Array of all itemids currently in the order summary.
 */
function populateGUI(menu_items){
    for(var i = 0; i<menu_items.length; i++){
        var entrees = document.getElementById('entrees');
        var sides = document.getElementById('sides');
        var desserts = document.getElementById('desserts');
        var drinks = document.getElementById('drink-menu');
        switch(menu_items[i].type){
            case "entree":
                var button = "<button onclick=\"addToOrder("+menu_items[i].menu_id+", '"+menu_items[i].item_name+"', '1', '"+menu_items[i].item_price+"')\"> "+menu_items[i].item_name+" </button>";
                entrees.innerHTML += button;
                break;
            case "side":
                var button = "<button onclick=\"addToOrder("+menu_items[i].menu_id+", '"+menu_items[i].item_name+"', '1', '"+menu_items[i].item_price+"')\"> "+menu_items[i].item_name+" </button>";
                sides.innerHTML += button;
                break;
            case "drink":
                var button = "<button onclick=\"addToOrder("+menu_items[i].menu_id+", '"+menu_items[i].item_name+"', '1', '"+menu_items[i].item_price+"')\"> "+menu_items[i].item_name+" </button>";
                drinks.innerHTML += button;
                break;
            case "dessert":
                var button = "<button onclick=\"addToOrder("+menu_items[i].menu_id+", '"+menu_items[i].item_name+"', '1', '"+menu_items[i].item_price+"')\"> "+menu_items[i].item_name+" </button>";
                desserts.innerHTML += button;
                break;
        }
    }
}

/**
 * Opens the drinks menu in GUI
 * @function
 */
function openDrinks() {
  document.getElementById("drink-menu").style.display = "block";
}

/**
 * Closes the drinks menu in GUI
 * @function
 */
function closeDrinks() {
  document.getElementById("drink-menu").style.display = "none";
}