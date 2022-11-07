
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
}

function clearOrder(){
    var table = document.getElementById('orderTable');
    console.log(myOrder.orders.length);
    for(let i = 0; i<myOrder.orders.length; i++){
        table.deleteRow(1);
    }
    myOrder.clear();
    console.log(myOrder.orders.length);
}

function submitOrder(pool){
    console.log("test")
    var results = pool.query('select * from teammembers');
    console.log(results.rows);
}


