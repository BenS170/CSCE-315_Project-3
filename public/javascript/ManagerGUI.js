function makeMenuTable(data){
    htmlMenuTable = '<table> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Menu ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Name</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Price</th>";
    htmlMenuTable = htmlMenuTable + "<th>No. Ingredients</th>";
    htmlMenuTable = htmlMenuTable + "<th>Ingredients List</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Type</th>";
    htmlMenuTable = htmlMenuTable + "</tr>";

    for (let i = 0; i < data.result.length; i++){
        htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].menu_id + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_name + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].item_price + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].num_ingredients + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + prettyArrayStr(data.result[i].ingredient_list) + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].type + "</td>";
        htmlMenuTable = htmlMenuTable + "</tr>";
    }
    htmlMenuTable = htmlMenuTable + "</table>";
    return htmlMenuTable;
}

function prettyArrayStr(array){
    arrayStr = "";
    for (let i = 0; i < array.length; i++){
        arrayStr = arrayStr + array[i];
        if (i != (array.length-1)){
            arrayStr = arrayStr + ", ";
        }
    }

    return arrayStr;
}

const viewMenuButton = document.getElementById("viewMenuButton");

viewMenuButton.addEventListener('click', function(e) {
    console.log('view menu was clicked');
  
    fetch('/getMenu', {method: 'GET'})
        .then(function(response) {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
            .then(function(data) {
            // TODO: Modify HTML using the information received from the database
            content = document.getElementById("managerView");
            htmlMenuTable = makeMenuTable(data);
            content.innerHTML = htmlMenuTable;

            console.log(data.result);
        })
        .catch(function(error) {
            console.log(error);
    });
});



const addMenuItemButton = document.getElementById("addMenuItemButton");

addMenuItemButton.addEventListener('click', function(e) {
  console.log('add menu was clicked');
  const menuID = prompt("What is the menu ID?");
  const menuName = prompt("What is the name of the item?");
  const menuPrice = prompt("What is the new price");
  const menuIngredients = prompt("What ingredients do you want for the new item?");
  const menuIngNum = prompt("How many ingredients is in the new item");
  const menuType = prompt("What type of item is this?");
  
  const data = {menuID, menuName,menuPrice, menuIngredients, menuIngNum, menuType};

  fetch('/addMenuItem', {
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


const  updateMenuItemButton = document.getElementById("updateMenuItemButton");

updateMenuItemButton.addEventListener('click', function(e) {
  console.log('update menu was clicked');
  const menuID = prompt("What is the menu ID?");
  const menuPrice = prompt("What is the new price");
 
  
  const data = {menuID,menuPrice};

  fetch('/updateMenuItem', {
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


const  deleteMenuItemButton = document.getElementById("deleteMenuItemButton");

deleteMenuItemButton.addEventListener('click', function(e) {
  console.log('menu delete was clicked');
  const menuID = prompt("What is the menu ID?"); 
  
  const data = {menuID};

  fetch('/deleteMenuItem', {
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



function makeInventoryTable(data){
    htmlMenuTable = '<table> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Item ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Stock Price</th>";
    htmlMenuTable = htmlMenuTable + "<th>Units</th>";
    htmlMenuTable = htmlMenuTable + "<th>Quantity Remaining</th>";
    htmlMenuTable = htmlMenuTable + "<th>Serving Size</th>";
    htmlMenuTable = htmlMenuTable + "<th>Quantity Needed</th>";
    htmlMenuTable = htmlMenuTable + "</tr>";

    for (let i = 0; i < data.result.length; i++){
        htmlMenuTable = htmlMenuTable + '<tr id = "menuItem">';
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].itemid + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].stockprice + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].unit + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].quantity + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].serving_size + "</td>";
        htmlMenuTable = htmlMenuTable + "<td>" + data.result[i].quantity_needed + "</td>";
        htmlMenuTable = htmlMenuTable + "</tr>";
    }
    htmlMenuTable = htmlMenuTable + "</table>";
    return htmlMenuTable;
}

const viewInventoryButton = document.getElementById("viewInventoryButton");

viewInventoryButton.addEventListener('click', function(e) {
    console.log('View Inventory was clicked');
  
    fetch('/getInv', {method: 'GET'})
        .then(function(response) {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
            .then(function(data) {
            // TODO: Modify HTML using the information received from the database
            content = document.getElementById("managerView");
            htmlInvTable = makeInventoryTable(data);
            content.innerHTML = htmlInvTable;

            console.log(data.result);
        })
        .catch(function(error) {
            console.log(error);
    });
})

// inventory functions
async function orderInventory(){
    alert("order inventory");

}

async function addInventoryItem(){
    alert("add inventory");

}


// manager reports
async function salesReport(){
    alert("sales report");

}

async function popularMenuReport(){
    alert("popular report");

}

async function excessReport(){
    alert("excess report");

}

async function restockReport(){
    alert("restock report");

}
