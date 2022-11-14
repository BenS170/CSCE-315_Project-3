

//This is for HTML purposes
class order{
    constructor(name, qty, price){
        this.name = name;
        this.qty = qty;
        this.price = price;
    }
}

class orderSum{
    constructor(){
        this.orders = [];
    }

    addOrder(name, qty, price){
        var o = new order(name, qty, price);
        this.orders.push(o)
        return o;
    }

    clear(){
        this.orders = [];
    }
}

var myOrder = new orderSum();
var order_items = [];
var order_prices = [];

function addToOrder(itemid, name, qty, price){

    if(order_items.includes(itemid)){
        incQty(itemid, name, price);
        return;
    }

    order_items.push(itemid);
    order_prices.push(price);

    myOrder.addOrder(name, qty, price);

    var inc = document.createElement('input');
    inc.type = "button";
    inc.value = "+";
    inc.onclick = function(){
        incQty(itemid, name, price);
    };

    var dec = document.createElement('input');
    dec.type = "button";
    dec.value = "-";
    dec.onclick = function(){
        decQty(itemid, name, price);
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
    cell3.innerHTML = qty;
    cell4.appendChild(inc);
    cell5.innerHTML = price;

    var tax_h = document.getElementById('tax');
    tax_h.innerHTML = Number((getTax()).toFixed(2));
    let total = Number((parseFloat(getTax()) + parseFloat(getTotal())).toFixed(2));
    var total_h = document.getElementById('total')
    total_h.innerHTML = total;

}

function incQty(itemid, name, price){
    order_items.push(itemid);
    order_prices.push(price);

    var table = document.getElementById('orderTable');
    for(var i = 1; i<table.rows.length; i++){
        var row = table.getElementsByTagName('tr')[i];
        var cell = row.cells[0];
        if(cell.innerHTML == name){
            //increasing quantity
            cell = row.cells[2];
            cell.innerHTML++;

            //increasing price
            cell = row.cells[4];
            cell.innerHTML = Number((parseFloat(cell.innerHTML) + parseFloat(price)).toFixed(2));
        }
    }
    

    var tax_h = document.getElementById('tax');
    tax_h.innerHTML = Number((getTax()).toFixed(2));
    let total = Number((parseFloat(getTax()) + parseFloat(getTotal())).toFixed(2));
    var total_h = document.getElementById('total')
    total_h.innerHTML = total;
    
}

function decQty(itemid, name, price){
    order_items.splice(order_items.indexOf(itemid), 1);
    order_prices.splice(order_prices.indexOf(price), 1);

    var table = document.getElementById('orderTable');
    for(var i = 1; i<table.rows.length; i++){
        var row = table.getElementsByTagName('tr')[i];
        var cell = row.cells[0];
        if(cell.innerHTML == name){
            //decreasing quantity
            cell = row.cells[2];
            cell.innerHTML--;
            if(cell.innerHTML == '0'){
                table.deleteRow(i);
            }

            //decreasing price
            cell = row.cells[4];
            cell.innerHTML = Number((parseFloat(cell.innerHTML) - parseFloat(price)).toFixed(2));
        }
    }

    var tax_h = document.getElementById('tax');
    tax_h.innerHTML = Number((getTax()).toFixed(2));
    let total = Number((parseFloat(getTax()) + parseFloat(getTotal())).toFixed(2));
    var total_h = document.getElementById('total');
    total_h.innerHTML = total;
    
}

function clearOrder(){
    var table = document.getElementById('orderTable');
    for(let i = 0; i<myOrder.orders.length; i++){
        table.deleteRow(1);
    }
    myOrder.clear();
    order_items = [];
    order_prices = [];

    var tax_h = document.getElementById('tax');
    tax_h.innerHTML = getTax();
    var total = getTax() + getTotal();
    var total_h = document.getElementById('total');
    total_h.innerHTML = total;
}

function getTotal(){
    let total = 0;
    for(let i = 0; i<order_prices.length; i++){
        total += parseFloat(order_prices[i]);
    }
    return total;
}

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

function googleTranslateElementInit(){
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}