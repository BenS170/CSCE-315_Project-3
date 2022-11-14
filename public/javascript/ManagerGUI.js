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
        htmlMenuTable = htmlMenuTable + '<td contentEditable="true">'+ data.result[i].menu_id + "</td>";
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
});

// inventory functions
async function orderInventory(){
    alert("order inventory");
}

async function addInventoryItem(){
    alert("add inventory");

}
// manager reports

// Helper function: 

/* 
IMPORTANT: dateSelectors has a value: 
    0 - NULL
    1 - Sales report
*/
SALES = 1;

function getStartDate(){
    month = document.getElementById("startMonth");
    day = document.getElementById("startDay");
    year = document.getElementById("startYear");
    return year.options[year.selectedIndex].text + "-" + month.value + "-" + day.options[day.selectedIndex].text;
}

function getEndDate(){
    month = document.getElementById("endMonth");
    day = document.getElementById("endDay");
    year = document.getElementById("endYear");
    return year.options[year.selectedIndex].text + "-" + month.value + "-" + day.options[day.selectedIndex].text;
}

//Sales Report - Given a time window, display the sales by item from the order history

const createSalesReport = document.getElementById("salesReportButton");
createSalesReport.addEventListener('click', function(e) {
    console.log('Sales Report Button was clicked');
    document.getElementById("managerView").hidden = true;
    document.getElementById("dateSelectors").hidden = false;
    document.getElementById("dateSelectors").value = SALES;
});

const submitDate_SALES = document.getElementById("submitDates");
submitDate_SALES.addEventListener('click', function(e) {
    // IMPORTANT: Check if the "Submit Dates" button was clicked 
    // because the manager wanted a sales report:
    if (document.getElementById("dateSelectors").value != SALES){
        return;
    }

    startDate = getStartDate();
    endDate = getEndDate();

    document.getElementById("dateSelectors").hidden = true;
    document.getElementById("managerView").hidden = false;
    salesReportLogic(startDate, endDate);
});

function salesReportLogic(startDate, endDate){
    // SALES QUERY:
    console.log(startDate + " to " + endDate);
    const data = {startDate, endDate};
  
    fetch('/getSalesRep', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(function(response) {
        if (response.ok){return response.json();}
        throw new Error('Request failed.');
    }).then(function(data){
        console.log(data.result);
        
        htmlSalesRep = salesReport(data);
        console.log(htmlSalesRep);
        content = document.getElementById("managerView");
        content.innerHTML = htmlSalesRep;

    }).catch(function(error) {
        console.log(error);
    }
);}

function salesReport(data){
    salesTable = '<table><tbody><tr>';
    salesTable = salesTable + "<th>Item Name</th>";
    salesTable = salesTable + "<th>Sales</th>";
    salesTable = salesTable + "<th>Profit</th>";
    salesTable = salesTable + "</tr>"
    for (let i = 0; i < data.result.length; i++){
        salesTable = salesTable + '<tr id = "itemSold">';
        salesTable = salesTable + "<td>" + data.result[i].item_name + "</td>";
        salesTable = salesTable + "<td>" + data.result[i].sales + "</td>";
        salesTable = salesTable + "<td>" + data.result[i].profit + "</td>";
        salesTable = salesTable + "</tr>"
    }
    
    salesTable = salesTable + '</tbody></table>'
    return salesTable;
}


// Excess Report - Given a timestamp, display the list of items that only sold less than 10% of their inventory between the timestamp and the current time, assuming no restocks have happened during the window.
const createPopMenuItemReport = document.getElementById("popMenuItemButton");


// Restock Report - Display the list of items whose current inventory is less than the item's minimum amount to have around before needing to restock.
const createExcessReport = document.getElementById("excessReportButton");

// New Seasonal Menu Item - Your vendor just got a new seasonal menu item they have never sold before. Provide and demonstrate the ability to add this menu item to their POS (and any associated inventory items).
const createRestockReport = document.getElementById("restockReportButton");

// (Teams of 5 Only) What Sales Together - Given a time window, display a list of pairs of menu items that sell together often, popular or not, sorted by most frequent.
const createSalesTogetherReport = document.getElementById("salesTogetherButton");

function googleTranslateElementInit(){
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}
