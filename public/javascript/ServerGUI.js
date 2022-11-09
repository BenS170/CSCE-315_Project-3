

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
    order_items.push(itemid);
    order_prices.push(price);

    myOrder.addOrder(name, qty, price);
    var table = document.getElementById('orderTable');
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = name;
    cell2.innerHTML = qty;
    cell3.innerHTML = price;

    var tax_h = document.getElementById('tax');
    tax_h.innerHTML = Number((getTax()).toFixed(2));
    let total = Number((parseFloat(getTax()) + parseFloat(getTotal())).toFixed(2));
    var total_h = document.getElementById('total')
    total_h.innerHTML = total;

    console.log(order_items);
    console.log(order_prices);
}

function clearOrder(){
    var table = document.getElementById('orderTable');
    console.log(myOrder.orders.length);
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
    for(let i = 0; i<myOrder.orders.length; i++){
        total += parseFloat(myOrder.orders[i].price);
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