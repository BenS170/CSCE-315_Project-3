function makeMenuTable(data){    
    htmlMenuTable = '<div id="tableAndUpdateButton"> <table id="menuTable"> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Menu ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Name</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Price</th>";
    //htmlMenuTable = htmlMenuTable + "<th>No. Ingredients</th>";
    htmlMenuTable = htmlMenuTable + "<th>Ingredients List</th>";
    htmlMenuTable = htmlMenuTable + "<th>Item Type</th>";
    htmlMenuTable = htmlMenuTable + "</tr>";

    currColor = "grey";
    for (let i = 0; i < data.result.length; i++){
        if (i%2){
            currColor = "lightgray";
        }else{
            currColor = "white";
        }

        htmlMenuTable = htmlMenuTable + '<tr id = "menuItem" style="background-color:' + currColor + '">';
        htmlMenuTable = htmlMenuTable + '<td>'+ data.result[i].menu_id + "</td>";
        htmlMenuTable = htmlMenuTable + '<td contenteditable="true">' + data.result[i].item_name + "</td>";
        htmlMenuTable = htmlMenuTable + '<td>$<p contenteditable="true">' + data.result[i].item_price + "</p></td>";
        htmlMenuTable = htmlMenuTable + '<td hidden="true">' + data.result[i].num_ingredients + "</td>";
        htmlMenuTable = htmlMenuTable + '<td contenteditable="true">' + prettyArrayStr(data.result[i].ingredient_list) + "</td>";
        htmlMenuTable = htmlMenuTable + '<td contenteditable="true">' + data.result[i].type + "</td>";
        htmlMenuTable = htmlMenuTable + "</tr>";
    }
    htmlMenuTable = htmlMenuTable + '</table><button id="updateTable" onClick="updateTableFunction()">Update Table</button></div>';
    return htmlMenuTable;
}

/* Triggered when the updateTable button is pressed */
function revertToEnglish(){
    var selectField = document.querySelector("#google_translate_element select").selected;
    console.log(selectField);

    var iframe = document.getElementsByClassName('goog-te-banner-frame')[0];
    if(!iframe) return selectField;

    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    var restore_el = innerDoc.getElementsByTagName("button");

    for(var i = 0; i < restore_el.length; i++){
        if(restore_el[i].id.indexOf("restore") >= 0) {
            restore_el[i].click();
            var close_el = innerDoc.getElementsByClassName("goog-close-link");
            close_el[0].click();
            return selectField;
        }
    }
}

function fetchPost(functionName, data){
    var returnMe = "";
    fetch(functionName, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(function(response) {
        if(response.ok) {
            return;
        }else{ throw new Error('Request failed.'); }
    }).then(function(data){
        console.log(data.result);
        returnMe = data.result;
        return data.result;
    }).catch(function(error) {
        console.log(error);
    })

    return returnMe;
}

async function updateTableFunction(){
    // Revert back to english:
    revertToEnglish();

    var menuTable = document.getElementById("menuTable");
    for (let i = 1, row; row = menuTable.rows[i]; i++){
        // iterating through rows. Starting at row 1 bc 0 is headers
        menu_id = -1;
        item_name = "";
        item_price = "";
        num_ingredients = -1;
        ingredient_list = "";
        type = "";
        for (let j = 0, col; col = row.cells[j]; j++){
            if (j == 0){ menu_id = col.textContent; }
            else if (j == 1){ item_name = col.textContent; }
            else if (j == 2){ item_price = col.textContent; }
            else if (j == 3){ num_ingredients = col.textContent; }
            else if (j == 4){ ingredient_list = col.textContent; }
            else if (j == 5){ type = col.textContent; }
            else { break; }
        }

        const data = {menu_id, item_name, item_price, num_ingredients, ingredient_list, type};
        console.log(data);
        x = await fetchPost('/updateMenuItem', data);
    }
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

    document.getElementById("dateSelectors").hidden = true;
    document.getElementById("managerView").hidden = false;
  
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

/*************** ADD MENU ITEM **********************/

const addMenuItemButton = document.getElementById("addMenuItemButton");

addMenuItemButton.addEventListener('click', function(e) {
  console.log('add menu was clicked');
  const menuID = prompt("What is the menu ID?", "23");
  if(menuID == null || menuID == ""){
    alert("add menu item was canceled");
  } else{
    const menuName = prompt("What is the name of the item?", "bacon");
    if (menuName == null || menuName == ""){
        alert("add menu item was canceled");
    } else {
        const menuPrice = prompt("What is the new price", "2.90");
        if (menuPrice == null || menuPrice == ""){
            alert("add menu item was canceled");
        } else{
            const menuIngredients = prompt("What ingredients do you want for the new item?", 'i.e. {lettuce, bacon, "salad dressing", ...}');
            if (menuIngredients == null || menuIngredients == ""){
                alert("add menu item was canceled");
            } else {
                const menuIngNum = prompt("How many ingredients is in the new item");
                const commas = 0;
                if (menuIngredients.length() > 0){
                    commas = 1;
                    for(var i = 0; i < menuIngredients.length(); i++){
                        if(i == ","){
                            commas++;
                        }
    
                    }

                }

                menuIngNum = toString(commas);
                
                if (menuIngNum == null || menuIngNum == "" || menuIngNum == "0"){
                    alert("add menu item was canceled");
                } else{
                    const menuType = prompt("What type of item is this?", "entree");
                    if (menuType == null || menuType == ""){
                        alert("add menu item was canceled");
                    } else{

                        if (confirm(" are you sure you want to make an item with these values? (id, name, price, ingredients, type" + menuID + ", " + menuName + ", " + menuPrice + ", " + menuIngredients, ", " + menuType)){
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
                        }
                        
                      }
                    }

                }
            }

        }
    }
});

/**************** UPDATE MENU ITEM *****************************/

const  updateMenuItemButton = document.getElementById("updateMenuItemButton");

updateMenuItemButton.addEventListener('click', function(e) {
  console.log('update menu was clicked');
  const menuID = prompt("What is the menu ID?", "1");
  if (menuID == null || menuID == ""){
    alert("menu update canceled");
  } else {
    if (confirm("Do you want to update the price?")){
        const menuPrice = prompt("What is the new price");
     
        const data = {menuID,menuPrice};
    
        fetch('/updateMenuPriceItem', {
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
      } else {
        if (confirm("Do you want to update the name?")){
            const menuName = prompt("What is the new name?");

            const data2 = {menuID,menuName};

            fetch('/updateMenuNameItem', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data2)
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

        }
      }

  }
  
});


/*************** DELETE MENU ITEM ***********************/
const  deleteMenuItemButton = document.getElementById("deleteMenuItemButton");

deleteMenuItemButton.addEventListener('click', function(e) {
  console.log('menu delete was clicked');
  const menuID = prompt("What is the menu ID?", "1");
  if(menuID == null || menuID == ""){
    alert("add menu item was canceled");
  } else{
    const data = {menuID};

    if (confirm("Are you suer that you want to delete item: " + menuID)){
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
      }

    }
  
});

let modified = false;
let originalInvItems = [];
let oldInvItems = [];

function makeInventoryTable(data){
    oldInvItems = [];
    htmlMenuTable = '<div id="tableAndUpdateButton">';
    htmlMenuTable = htmlMenuTable + '<table id="inventoryTable"> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Item ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Stock Price</th>";
    htmlMenuTable = htmlMenuTable + "<th>Units</th>";
    htmlMenuTable = htmlMenuTable + "<th>Quantity Remaining</th>";
    htmlMenuTable = htmlMenuTable + "<th>Serving Size</th>";
    htmlMenuTable = htmlMenuTable + "<th>Quantity Needed</th>";
    htmlMenuTable = htmlMenuTable + "</tr>";

    currColor = "";
    for (let i = 0; i < data.result.length; i++){
        let currItem = [];
        if (i%2){ currColor = "lightgray"; }
        else{ currColor = "white"; }
        htmlMenuTable = htmlMenuTable + '<tr id = "menuItem" style="background-color:' + currColor + '">';
        htmlMenuTable = htmlMenuTable + '<td contenteditable="true">' + data.result[i].itemid + "</td>";
        htmlMenuTable = htmlMenuTable + '<td contenteditable="true">' + data.result[i].stockprice + "</td>";
        htmlMenuTable = htmlMenuTable + '<td contenteditable="true">' + data.result[i].unit + "</td>";
        htmlMenuTable = htmlMenuTable + '<td contenteditable="true">' + data.result[i].quantity + "</td>";
        htmlMenuTable = htmlMenuTable + '<td contenteditable="true">' + data.result[i].serving_size + "</td>";
        htmlMenuTable = htmlMenuTable + '<td>' + data.result[i].quantity_needed + "</td>";
        htmlMenuTable = htmlMenuTable + "</tr>";
        
        // We want a sort-of "backup" in the case the manager makes a mistake
        if (!modified){ originalInvItems.push(data.result[i]); }
        oldInvItems.push(data.result[i]);
    }
    modified = true;
    htmlMenuTable = htmlMenuTable + "</table>";
    htmlMenuTable = htmlMenuTable + '</table><button id="updateInvTable" onClick="updateInvFunction()">Update Table</button></div>';
    return htmlMenuTable;
}

const viewInventoryButton = document.getElementById("viewInventoryButton");

viewInventoryButton.addEventListener('click', function(e) {
    console.log('View Inventory was clicked');
    document.getElementById("dateSelectors").hidden = true;
    document.getElementById("managerView").hidden = false;
  
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

/********************** ORDER INVENTORY *********************/

orderInventoryButton.addEventListener('click', function(e) {
    console.log('order inventory was clicked');
  
    const inventoryIDPrompt = prompt("What is the inventory ID?", "i.e. bacon");
    prompt()
    if (inventoryIDPrompt == NULL || inventoryIDPrompt == ""){
      alert("Order Inventory was cancelled")
    }else{
      const inventoryQuantity = prompt("what is the quantity to update to?", "100");
      if (inventoryQuantity == NULL || inventoryQuantity == ""){
          alert("order inventory was cancelled")
      } else{
  
          const inventoryID = inventoryIDPrompt.toLowerCase();
  
          const data = {inventoryID, inventoryQuantity};
          fetch('/orderInventoryItem', {
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
      }
     }
  
    
  
  });


  /************************* ADD INVENTORY ITEM ************************/

  const addInventoryItemButton = document.getElementById("addInventoryItemButton");

  addInventoryItemButton.addEventListener('click', function(e) {
    console.log('add inventory was clicked');
    const inventoryID = prompt("What is the inventory ID?", "i.e. bacon");
    if (inventoryID == ""){
      alert("Add inventory was canceled")
    } else{
      const inventoryStockprice = prompt("What is the stockprice of this item?", "23");
      if (inventoryID == ""){
          alert("Add inventory was canceled")
      } else{  
          const inventoryUnits = prompt("What is the units of the item?", "Gallons");
          if (inventoryID == ""){
              alert("Add inventory was canceled")
          } else{
              const inventoryQuantity = prompt("How much of the item do you have?", "0");
              if (inventoryID == ""){
                  alert("Add inventory was canceled")
              } else{
                  const inventoryServingSize = prompt("What is the serving size for this item?",".25");
                  if (inventoryID == ""){
                      alert("Add inventory was canceled")
                  } else{
                      const inventoryNeeded = prompt("How much of the item is needed?","400");
                      if (inventoryID == ""){
                          alert("Add inventory was canceled")
                      } else{
                              
                          const data = {inventoryID, inventoryStockprice, inventoryUnits, inventoryQuantity, inventoryServingSize, inventoryNeeded};
            
                          fetch('/addInventoryItem', {
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
                          }
                      }
                  }
              }
          }
      }
    
  });


// manager reports

// Helper function: 

/* 
IMPORTANT: dateSelectors has a value: 
    0 - NULL
    1 - Sales report
    2 - getPopMenuItems
*/
SALES = 1;
POPITEMS = 2;
EXCESS = 3;
RESTOCK = 4;

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
    document.getElementById("hideMe").hidden = false;
    document.getElementById("dateSelectors").value = SALES;
});

const submitDates = document.getElementById("submitDates");
submitDates.addEventListener('click', function(e) {
    // IMPORTANT: Check if the "Submit Dates" button was clicked 
    // because the manager wanted a sales report:
    submitDateLogic();
});

function checkIfValidDates(startDate, endDate){
    // split() will create an array of { year, month, day }
    let start = startDate?.split("-");
    let end = endDate?.split("-");

    // Check the years:
    if (end[0] > start[0]){
        return true;
    }else if (end[0] == start[0]){

        // If the years are equal, check months:
        if (end[1] > start[1]){
            return true;

        }else if (end[1] == start[1]){

            // If the years and months are equal, check days:
            if (end[2] >= start[2]){
                return true;
            }
        }
    }

    return false;
}

function submitDateLogic(){
    startDate = getStartDate();
    endDate = getEndDate();

    value = document.getElementById("dateSelectors").value;

    let datesAreValid = true;

    // We do not need to do the check for the excess report since it only takes one date
    if (value != EXCESS){ datesAreValid = checkIfValidDates(startDate, endDate); }

    if (!datesAreValid){
        // If the user entered invalid dates, tell them and return
        alert("Invalid Date Entered. Please Try Again");
        return;
    }

    document.getElementById("dateSelectors").hidden = true;
    document.getElementById("managerView").hidden = false;

    if (value == SALES){
        salesReportLogic(startDate, endDate);
    }else if (value == POPITEMS){
        popReportLogic(startDate, endDate);
    }else if (value == EXCESS){
        excessReportLogic(startDate);
    }else if (value == RESTOCK){
        restockReportLogic(startDate, endDate);
    }
}

function salesReport(data){
    salesTable = '<p id = "salesReportTitle">Sales Report</p><table><tbody><tr>';
    salesTable = salesTable + "<th>Item Name</th>";
    salesTable = salesTable + "<th>Sales</th>";
    salesTable = salesTable + "<th>Profit</th>";
    salesTable = salesTable + "</tr>";
    let currColor = "";
    for (let i = 0; i < data.result.length; i++){
        if (i%2){ currColor = "lightgray"; }
        else{ currColor = "white"; }
        salesTable = salesTable + '<tr id = "itemSold" style="background-color:' + currColor + '">';
        salesTable = salesTable + "<td>" + data.result[i].item_name + "</td>";
        salesTable = salesTable + "<td>" + data.result[i].sales + "</td>";
        salesTable = salesTable + "<td>" + data.result[i].profit + "</td>";
        salesTable = salesTable + "</tr>"
    }
    
    salesTable = salesTable + '</tbody></table>'
    return salesTable;
}

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

async function getMenuItemArray(){
    arr = new Array();
    await fetch('/getMenu', {method: 'GET'})
        .then(function(response) {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        }).then(function(data) {
            // TODO: Modify HTML using the information received from the database
            for (var i = 0; i < data.result.length; i++){
                arr.push(data.result[i]);
            }
        })
        .catch(function(error) {
            console.log(error);
        }
    );

    for (let i = 0; i < arr.length; i++){
        let ingList = arr[i].ingredient_list;
        for (let j = 0; j < ingList.length; j++){
            if (arr[i].ingredient_list[j].charAt(0) == " "){
                arr[i].ingredient_list[j] = arr[i].ingredient_list[j].slice(1,arr[i].ingredient_list[j].length);
            }
        }
    }

    return arr;
}

async function getOrdersBetweenDates(startDate, endDate){
    orders = new Array();

    const data = {startDate, endDate};

    await fetch('/getOrdersBetweenDates', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)

    }).then(function(response) {
        if (response.ok){return response.json();}
        throw new Error('Request failed.');

    }).then(function(data){
        orders = new Array();
        for (let i = 0; i < data.result.length; i++){
            if (i == 0){
                orders.push(data.result[i]);
                items = Array();
                items.push(orders.at(orders.length-1).item);
                orders.at(orders.length-1).item = items;
            }else{
                if (orders.at(orders.length-1).order_id == data.result[i].order_id){
                    orders.at(orders.length-1).item.push(data.result[i].item);
                }else{
                    orders.push(data.result[i]);
                    items = Array();
                    items.push(orders.at(orders.length-1).item);
                    orders.at(orders.length-1).item = items;
                }
            }
        }

    }).catch(function(error) {
        console.log(error);
    });

    return orders;
}

/********************************   POPULAR MENU ITEMS   ************************************************/
const createPopMenuItemReport = document.getElementById("popMenuItemButton");
createPopMenuItemReport.addEventListener('click', function(e){
    document.getElementById("dateSelectors").value = POPITEMS;
    document.getElementById("dateSelectors").hidden = false;
    document.getElementById("hideMe").hidden = false;
    document.getElementById("managerView").hidden = true;
});

function removeDuplicateItems(curr_order){
    uniqueItems = Array();
    for (let i = 0; i < curr_order?.['item'].length; i++){
        if (!uniqueItems.includes(curr_order?.['item'][i])){
            uniqueItems.push(curr_order?.['item'][i]);
        }
    }
    return uniqueItems;
}

function makeEmptyArr(orders, maxItem){
    arr = Array(maxItem);

    for (let i = 0; i < arr.length; i++){
        arr[i] = Array(maxItem).fill(0);
    }

    return updateHashMap(orders, arr, maxItem);
}

async function updateHashMap(orders, hashMap){
    for (let i = 0; i < orders?.length; i++){
        items = await removeDuplicateItems(orders[i]);
        for (let j = 0; j < items?.length; j++){
            for (let k = j+1; k < items?.length; k++){
                let menu_id1 = items[j];
                let menu_id2 = items[k];
                try{
                    hashMap[menu_id1][menu_id2]++;
                }catch(e){/*Do nothing*/}
            }   
        }
    }
    return hashMap;
}

function displayPopItems(startDate, endDate, menuItemsAndQtyArr, maxItems){
    htmlStr = '<div id="popMenuItems"><p>Popular Item Pairs from ' + startDate + ' to ' + endDate + '</p>';
    htmlStr = htmlStr + '<table><tr id = "titleRow">';
    htmlStr = htmlStr + '<th>Item 1</th><th>Item 2</th><th>Quantity Sold</th></tr>';
    var currColor = "";
    for (let i = 0; i < Math.min(maxItems, menuItemsAndQtyArr.length); i++){
        if (i%2){ currColor = "lightgray"; }
        else{ currColor = "white"; }
        htmlStr = htmlStr + '<tr id="itemSold" style="background-color:'+currColor+ '"><td>' + menuItemsAndQtyArr[i][0] + '</td>';
        htmlStr = htmlStr + '<td>' + menuItemsAndQtyArr[i][1] + '</td>';
        htmlStr = htmlStr + '<td>' + menuItemsAndQtyArr[i][2] + '</td></tr>';
    }
    htmlStr = htmlStr + '</table></div>';
    cont = document.getElementById("managerView");
    cont.innerHTML = htmlStr;
}

function makeArrayOfMenuItemsAndQty(hashMap, menuItems){
    let menuItemsAndQtyArr = Array();
    for (let i = 0; i < hashMap.length; i++){
        for (let j = 0; j < hashMap.length; j++){
            if (hashMap[i][j] > 0){
                let menuItemsAndQty = [menuItems[i-1]?.['item_name'], menuItems[j-1]?.['item_name'], hashMap[i][j]];
                menuItemsAndQtyArr.push(menuItemsAndQty);
            }
        }
    }
    return menuItemsAndQtyArr;
}

function compareQtySold( item1, item2 ){
    if (item1[2] > item2[2]){
        return -1;
    }
    if (item1[2] < item2[2]){
        return 1;
    }
    return 0;
}

async function popReportLogic(startDate, endDate){
    menuItems = await getMenuItemArray();
    orders = await getOrdersBetweenDates(startDate, endDate);

    maxItem = menuItems.at(menuItems.length-1).menu_id;
    
    // Create an empty hashmap containing all the items:
    // The quantity sold for every "pair" of items can be found on the hashmap with indeces [menu_id1-1][menu_id2-1]
    hashMap = await makeEmptyArr(orders, maxItem);
    let arrOfMenuItemsAndQty = await makeArrayOfMenuItemsAndQty(hashMap, menuItems);
    arrOfMenuItemsAndQty.sort( compareQtySold );

    displayPopItems(startDate, endDate, arrOfMenuItemsAndQty, 20);
}

/************************************ RESTOCK REPORT ******************************/

// Restock Report - Display the list of items whose current inventory is less than the item's minimum amount to have around before needing to restock.
const createRestockReport = document.getElementById("restockReportButton");

createRestockReport.addEventListener('click', function(e) {
    console.log('Restock Report Button was clicked');
    document.getElementById("managerView").hidden = true;
    document.getElementById("hideMe").hidden = false;
    document.getElementById("dateSelectors").hidden = false;
    document.getElementById("dateSelectors").value = RESTOCK;
});



function restockReportLogic(startDate, endDate){
    // SALES QUERY:
    console.log(startDate + " to " + endDate);
    const data = {startDate, endDate};
  
    fetch('/getRestockRep', {
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
        
        htmlRestockRep = restockReport(data);
        console.log(htmlRestockRep);
        content = document.getElementById("managerView");
        content.innerHTML = htmlRestockRep;

    }).catch(function(error) {
        console.log(error);
    }
);}

function restockReport(data){
    restockTable = '<table><tbody><tr>';
    restockTable = restockTable + "<th>Item Name</th>";
    restockTable = restockTable + "<th>Servings Sold</th>";
    restockTable = restockTable + "<th>Servings Needed</th>";
    restockTable = restockTable + "<th>Servings Left</th>";
    restockTable = restockTable + "</tr>"
    let currColor = "";
    for (let i = 0; i < data.result.length; i++){
        if (i%2){
            currColor = "lightgray";
        }else{
            currColor = "white";
        }
        restockTable = restockTable + '<tr id = "itemSold" style="background-color:' + currColor + '">';
        restockTable = restockTable + "<td>" + data.result[i].itemid + "</td>";
        restockTable = restockTable + "<td>" + data.result[i].servings_sold + "</td>";
        restockTable = restockTable + "<td>" + data.result[i].servings_needed + "</td>";
        restockTable = restockTable + "<td>" + data.result[i].servings_left + "</td>";
        restockTable = restockTable + "</tr>"

    }

    restockTable = restockTable + '</tbody></table>'
    return restockTable;
}

/********************** EXCESS REPORT *******************************/

// Excess Report - Given a timestamp, display the list of items that only sold less than 10% of their inventory between the timestamp and the current time, assuming no restocks have happened during the window.
const createExcessReport = document.getElementById("excessReportButton");

createExcessReport.addEventListener('click', function(e) {
    console.log('Excess Report Button was clicked');
    document.getElementById("managerView").hidden = true;
    document.getElementById("dateSelectors").hidden = false;

    document.getElementById("hideMe").hidden = true;


    document.getElementById("dateSelectors").value = EXCESS;
});



function excessReportLogic(startDate){
    // SALES QUERY:
    console.log("start from: " + startDate);
    const data = {startDate};
  
    fetch('/getExcessRep', {
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
        
        htmlExcessRep = excessReport(data);
        console.log(htmlExcessRep);
        content = document.getElementById("managerView");
        content.innerHTML = htmlExcessRep;

    }).catch(function(error) {
        console.log(error);
    }
);}

function excessReport(data){
    excessTable = '<p id="excessReportTitle">Excess Report</p><table><tbody><tr>';
    excessTable = excessTable + "<th>Item Name</th>";
    excessTable = excessTable + "<th>Quantity Sold</th>";
    excessTable = excessTable + "<th>Quantity</th>";
    excessTable = excessTable + "</tr>"
    let currColor = "";
    for (let i = 0; i < data.result.length; i++){
        if (i%2){
            currColor = "lightgray";
        }else{
            currColor = "white";
        }
        excessTable = excessTable + '<tr id = "itemSold" style="background-color:' + currColor + '">';
        excessTable = excessTable + "<td>" + data.result[i].itemid + "</td>";
        excessTable = excessTable + "<td>" + data.result[i].quantity_sold + "</td>";
        excessTable = excessTable + "<td>" + data.result[i].quantity + "</td>";
        excessTable = excessTable + "</tr>"
    }
    
    excessTable = excessTable + '</tbody></table>'
    return excessTable;
}

/************************ Inventory Table Modification ****************************/

// If they change the name of an item, we have to update its name in the inventory table
// AND ALSO modify its name in the menu item table (it's the same item, just different name)
    // This could be done with array_replace(ARR, ELEMENT_TO_REPLACE, REPLACEMENT)
    // OR
    // array_remove(ARR, ELEMENT_TO_REMOVE) then array_append(ARR, NEW_ELEMENT);

// A drop down would be cool to select the Units, but that can come in later

function updateInvFunction(){
    // Revert back to english:
    var invTable = document.getElementById("inventoryTable");
    for (let i = 1, row; row = invTable.rows[i]; i++){
        // iterating through rows. Starting at row 1 bc 0 is headers
        itemid = -1;
        stockprice = -1.0;
        unit = "";
        quantity = -1;
        serving_size = -1.0;

        for (let j = 0, col; col = row.cells[j]; j++){
            if (j == 0){ itemid = col.textContent; }
            else if (j == 1){ stockprice = col.textContent; }
            else if (j == 2){ unit = col.textContent; }
            else if (j == 3){ quantity = col.textContent; }
            else if (j == 4){ serving_size = col.textContent; }
            else if (j == 5){ quantity_needed = col.textContent; }
            else { break; }
        }
        let oldName = oldInvItems[i-1]["itemid"];

        const data = {itemid, stockprice, unit, quantity, serving_size, oldName};
        console.log(data);
        x = fetchPost('/updateInvItem', data);
        oldInvItems[i-1]["itemid"] = itemid;
        changeMenuItemInventoryArr(oldName, itemid);
    }
}

async function changeMenuItemInventoryArr(oldName, newName){
    let menuItems = await getMenuItemArray();
    for (let i = 0; i < menuItems.length; i++){
        if (menuItems[i]["ingredient_list"].includes(oldName)){
            menu_id = i+1
            
            newIngredients = [];
            for (let j = 0; j < menuItems[i]["ingredient_list"].length; j++){
                if (menuItems[i]["ingredient_list"][j] == oldName){
                    newIngredients.push(newName);
                }else{
                    newIngredients.push(menuItems[i]["ingredient_list"][j]);
                }
            }

            console.log("Old: " + menuItems[i]["ingredient_list"]);
            console.log("New: " + newIngredients);

            const data = {menu_id, newIngredients};
            let x = fetchPost("/updateMenuItemInventoryArr", data);

        }
    }
}

function makeIngredientCheckbox (menuItem, data) {
    let htmlStr = '<div id="ingredientSelector"><table id="ingredientSelectTable"><tr>';
    let checked = "";

    for (let i = 0; i < data.result.length; i++){
        let itemid = data.result[i].itemid;
        if (menuItem.ingredient_list.includes(itemid)){ 
            checked = "checked"; 
        }else{ 
            checked = ""; 
        }

        htmlStr = htmlStr + '<td><input type="checkbox" id="' + itemid + '" name="' + itemid + '"' + checked + ' value="yes">';
        htmlStr = htmlStr + '<label for="' + itemid + '">' + itemid + '</label></td>';

        if ((i%3 == 0 && i != 0) || (i == data.result.length-1)){
            htmlStr = htmlStr + '</tr>';
            if (i != data.result.length-1){
                htmlStr = htmlStr + '<tr>';
            }
        }
    }

    htmlStr = htmlStr + '</table><button id="ingSelectButton" onclick="getSelectedIngredients()">Select Ingredients</button></div>'
    return htmlStr;
}

async function populateIngredientCheckbox(){
    let menuItems = await getMenuItemArray();
    fetch('/getInv', {method: 'GET'})
        .then(function(response) {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
            .then(function(data) {
            // TODO: Modify HTML using the information received from the database
            // data contains the array
            content = document.getElementById("managerView");
            ingCheckbox = makeIngredientCheckbox(menuItems[0], data);
            content.innerHTML = ingCheckbox;
        })
        .catch(function(error) {
            console.log(error);
    });
}

function getSelectedIngredients(){
    var table = document.getElementById("ingredientSelectTable");
    var ingredientArr = [];
    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            let checkbox = col.querySelector("input");
            if (checkbox.checked){
                ingredientArr.push(checkbox.id);
            }
        }  
    }

    for (let i = 0; i < ingredientArr.length; i++){
        console.log("Selected Ingredients: " + ingredientArr[i]);
    }
    if (ingredientArr.length == 0){
        console.log("Ingredient select is empty");
    }
}

/********************** GOOGLE **********************/

function googleTranslateElementInit(){
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

// Initialize and add the map
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
