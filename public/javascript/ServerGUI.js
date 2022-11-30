
var order_rows = 0;
var order_items = [];
var order_prices = [];

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
    inc.value = "+";
    inc.onclick = function(){
        incQty(itemid, price);
    };

    var dec = document.createElement('input');
    dec.type = "button";
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

function clearOrder(){
    var table = document.getElementById('orderTable');
    for(let i = 0; i<order_rows; i++){
        console.log(typeof(table));
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