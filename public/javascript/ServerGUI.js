

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

function addToOrder(name, qty, price){
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
}

function clearOrder(){
    var table = document.getElementById('orderTable');
    console.log(myOrder.orders.length);
    for(let i = 0; i<myOrder.orders.length; i++){
        table.deleteRow(1);
    }
    myOrder.clear();

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

function submitOrder(pool){
    console.log("test");
    var results = pool.query('select * from teammembers');
    console.log(results.rows);
}


//This is for database
const testObj = '10';
const orderObj = new order('burger', 2, 7.35);

const button = document.getElementById("serverSubmit");
button.addEventListener('click', function(e) {
  console.log('Server submit was clicked');
  const data = {testObj, orderObj};

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
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});