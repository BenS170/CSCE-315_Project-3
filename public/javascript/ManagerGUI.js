/**
 * Creates an HTML table from the information passed in from data. 
 * @author Octavio Almanza
 * @param {Array} data - An array that contains information about all the menu items stored in the database. 
 * @returns {String} a string containing the HTML for a table with rows of menu items and their respective information
 */

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
        htmlMenuTable = htmlMenuTable + '<td><div id="ingredientsFor' + data.result[i].menu_id + '">' + prettyArrayStr(data.result[i].ingredient_list) + '<button class="editIngButtons" id="editMenu'+ data.result[i].menu_id +'" onclick="populateIngredientCheckbox('+ data.result[i].menu_id + ')">Edit</button></div></td>';

        var typeSelect = '<td><select id="typeSelect' + data.result[i].menu_id + '">';

        var isEntree = "";
        var isDrink = "";
        var isDessert = ""; 
        var isSide = "";

        if (data.result[i].type.toLowerCase() == 'entree'){ isEntree = "selected"; }
        else if (data.result[i].type.toLowerCase() == 'drink'){ isDrink = "selected"; }
        else if (data.result[i].type.toLowerCase() == 'side'){ isSide = "selected"; }
        else { isDessert = "selected"; }

        typeSelect += '<option value=entre ' + isEntree + ' >Entree</option>';
        typeSelect += '<option value=dessert ' + isDessert + '>Dessert</option>';
        typeSelect += '<option value=side ' + isSide + '>Side</option>';
        typeSelect += '<option value=drink ' + isDrink + ' >Drink</option>';
        typeSelect += '</select></td>';
        
        htmlMenuTable += typeSelect;

        //htmlMenuTable = htmlMenuTable + '<td contenteditable="true">' + data.result[i].type + "</td>";
        
        htmlMenuTable = htmlMenuTable + "</tr>";
    }
    htmlMenuTable = htmlMenuTable + '</table><button id="updateTable" onClick="updateTableFunction()">Update Table</button></div>';
    return htmlMenuTable;
}

/**
 * Resets the language back to English. Utilized to prevent conflicts with SQL database and the existing ingredients. Triggered when the updateTable button is pressed.
 * @author Octavio Almanza
 */

function revertToEnglish(){
    var selectField = document.querySelector("#google_translate_element select").selected;

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

    return true;
}

/**
 * Finds the appropriate POST function and calls it with the provided data. Returns the results of the POST function.
 * @author Octavio Almanza
 * @param {String} functionName - the name of the POST function in app.js that you want to call
 * @param {Array} data - the information to be passed into the POST function in the JSON format
 * @returns {JSON} the results obtained from the POST function in the JSON format
 */

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
        returnMe = data.result;
        return data.result;
    }).catch(function(error) {
        console.log(error);
    })

    return returnMe;
}

/**
 * Checks if there are currently any ingredient selectors currently open in the Manager View.
 * @param {Number} maxID The highest ID of a menu item in the table. 
 * @returns {Boolean} True if there is one or more ingredient selector open. False otherwise.
 */
function ingredientSelectorsOpen(maxID){
    for (let i = 1; i < maxID; i++){
        ingredientSelectorX = document.getElementById("editMenu" + i);
        if (ingredientSelectorX == null){
            alert("Please finish selecting all ingredients before updating table");
            return true;
        }
    }
    return false;
}

/**
 * Reads all the information updated by the manager using the application and updates the SQL menu item table to reflect the specified changes
 * @author Octavio Almanza
 */
async function updateTableFunction(){

    var menuTable = document.getElementById("menuTable");

    // If the user is still selecting ingredients, make sure that they are done selecting them!
    if (ingredientSelectorsOpen(menuTable.rows.length)){
        return;
    }

    // Revert back to english:
    let x = await revertToEnglish();

    console.log(x);

    for (let i = 1, row; row = menuTable.rows[i]; i++){
        // iterating through rows. Starting at row 1 bc 0 is headers
        menu_id = -1;
        item_name = "";
        item_price = "";
        num_ingredients = -1;
        ingredient_list = "";
        type = "";
        for (let j = 0, col; col = row.cells[j]; j++){
            if (j == 0){ 
                menu_id = col.textContent; 
            }
            else if (j == 1){ 
                item_name = col.textContent; 
            }
            else if (j == 2){ 
                item_price = col.textContent;
                var priceNoSign = item_price.replace("$", ""); 
                if (parseFloat(priceNoSign) <= 0){
                    alert("Price is less than or equal to 0 for Menu ID " + menu_id);
                    return;
                }else if (parseFloat(priceNoSign) == NaN){
                    alert("Invalid price for Menu ID: " + menu_id);
                    return;
                }
            }
            else if (j == 3){ 
                num_ingredients = col.textContent; 
            }
            else if (j == 4){ 
                ingredient_list = col.textContent; 
            }
            else if (j == 5){ 
                var typeDropDown = document.getElementById("typeSelect" + menu_id);
                type = typeDropDown.options[typeDropDown.selectedIndex].text.toLowerCase();
                //type = col.textContent; 
            }
            else { break; }
        }

        const data = {menu_id, item_name, item_price, num_ingredients, ingredient_list, type};
        console.log(data);
        x = await fetchPost('/updateMenuItem', data);
    }
    alert("The Menu Table has been Updated");
}

/**
 * A function that will read in an array and returns a string containing all of the elements of the array separated by ", "
 * @author Octavio Almanza
 * @param {Array} array - an array whose elements will be stringified
 * @returns {String} a string containing all of the array elements separated by the characters ", "
 */
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

/**
 * an object representing the "View Menu" button in the Manager GUI. The associated event listener function will trigger when clicked, and it will query the database to get the most up-to-date version of the menu and display it in the managerView HTML div.
 * @type {HTML}
 */
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
  
    const menuName = prompt("What is the name of the item?", "bacon");
    if (menuName == null || menuName == ""){
        alert("add menu item was canceled");
    } else {
        const menuPrice = prompt("What is the new price", "2.90");
        if (menuPrice == null || menuPrice == ""){
            alert("add menu item was canceled");
        } else{
            const menuIngredients = prompt("What ingredients do you want for the new item?", 'i.e. {lettuce, bacon, salad dressing, ...}');
            if (menuIngredients == null || menuIngredients == ""){
                alert("add menu item was canceled");
            } else {
                const menuIngNum = prompt("How many ingredients is in the new item");

                
                if (menuIngNum == null || menuIngNum == "" || menuIngNum == "0"){
                    alert("add menu item was canceled");
                } else{
                    const menuType = prompt("What type of item is this?", "entree");
                    if (menuType == null || menuType == ""){
                        alert("add menu item was canceled");
                    } else{

                        if (confirm(" are you sure you want to make an item with these values? (name, price, ingredients, type): " + menuName + ", " + menuPrice + ", " + menuIngredients, ", " + menuType)){
                            const data = {menuName,menuPrice, menuIngredients, menuIngNum, menuType};
  
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

/**
 * Stores the inventory items from the database at the beginning of the session.
 * @type {Array}
 */
let originalInvItems = [];

/**
 * Stores the inventory items from the database the last time "View Inventory" was pressed.
 * @type {Array}
 */
let oldInvItems = [];

/**
 * A function that will create a string containing HTML code to display a table of inventory items
 * @param {Array} data an array that contains information about all the inventory items in the database. 
 * @returns {String} a string containing the HTML representation of a table containing the inventory items and their corresponding values
 */
function makeInventoryTable(data){
    oldInvItems = [];
    htmlMenuTable = '<div id="tableAndUpdateButton">';
    htmlMenuTable = htmlMenuTable + '<table id="inventoryTable"> <tr id = "titleRow">';
    htmlMenuTable = htmlMenuTable + "<th>Item ID</th>";
    htmlMenuTable = htmlMenuTable + "<th>Stock Price</th>";
    htmlMenuTable = htmlMenuTable + '<th><div id="unitHeader">Units</div></th>';
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
        htmlMenuTable = htmlMenuTable + '<td contenteditable="true" class="unitCell">' + data.result[i].unit + "</td>";
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

/**
 * an object representing the "View Inventory" button in the Manager GUI. The associated event listener function will trigger when clicked, and it will query the database to get the most up-to-date version of the inventory and display it in the managerView HTML div.
 * @type {HTML}
 */
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
    if (inventoryIDPrompt == NULL || inventoryIDPrompt == ""){
      alert("Order Inventory was cancelled")
    }else{
      const inventoryQuantity = prompt("what is the quantity to update to?", "100");
      if (inventoryQuantity == NULL || inventoryQuantity == ""){
          alert("order inventory was cancelled")
      } else{
  
          const inventoryID = inventoryIDPrompt.toLowerCase();
  
          const data = {inventoryID, inventoryQuantity};
          if(confirm("Are you sure you want to order " + inventoryQuantity + " of " + inventoryIDPrompt + "?")){
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
     }
  
    
  
  });


  /************************* ADD INVENTORY ITEM ************************/

  const addInventoryItemButton = document.getElementById("addInventoryItemButton");

  addInventoryItemButton.addEventListener('click', function(e) {
    console.log('add inventory was clicked');
    const inventoryID = prompt("What is the inventory ID?", "i.e. bacon");
    if (inventoryID == "" || inventoryID == NULL){
      alert("Add inventory was canceled")
    } else{
      const inventoryStockprice = prompt("What is the stockprice of this item?", "23");
      if (inventoryStockprice == "" || inventoryStockprice == NULL){
          alert("Add inventory was canceled")
      } else{  
          const inventoryUnits = prompt("What is the units of the item?", "Gallons");
          if (inventoryUnits == "" || inventoryUnits == NULL){
              alert("Add inventory was canceled")
          } else{
              const inventoryQuantity = prompt("How much of the item do you have?", "0");
              if (inventoryQuantity == "" || inventoryQuantity == NULL){
                  alert("Add inventory was canceled")
              } else{
                  const inventoryServingSize = prompt("What is the serving size for this item?",".25");
                  if (inventoryServingSize == "" || inventoryServingSize == NULL){
                      alert("Add inventory was canceled")
                  } else{
                      const inventoryNeeded = prompt("How much of the item is needed?","400");
                      if (inventoryNeeded == "" || inventoryNeeded == NULL){
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

/**
 * @author Octavio Almanza
 * Will check the values currently stored in the datePanel1 div in the Manager GUI and return a string representing their value in a date format
 * @returns {String} a string of the form "YYYY-MM-DD"
 */
function getStartDate(){
    month = document.getElementById("startMonth");
    day = document.getElementById("startDay");
    year = document.getElementById("startYear");
    return year.options[year.selectedIndex].text + "-" + month.value + "-" + day.options[day.selectedIndex].text;
}

/**
 * @author Octavio Almanza
 * Will check the values currently stored in the datePanel2 div in the Manager GUI and return a string representing their value in a date format
 * @returns {String} a string of the form "YYYY-MM-DD"
 */
function getEndDate(){
    month = document.getElementById("endMonth");
    day = document.getElementById("endDay");
    year = document.getElementById("endYear");
    return year.options[year.selectedIndex].text + "-" + month.value + "-" + day.options[day.selectedIndex].text;
}

//Sales Report - Given a time window, display the sales by item from the order history
/**
 * An object that represents the "Sales Report" button in the Manager GUI. Its correponding event listener will be triggered when the button is clicked. It will hide the current content visible to the manager and display the date selector panel.
 * @type {HTML}
 */
const createSalesReport = document.getElementById("salesReportButton");
createSalesReport.addEventListener('click', function(e) {
    console.log('Sales Report Button was clicked');
    
    document.getElementById("reportType").innerHTML = "Sales Report";
    document.getElementById("instructStartDate").innerHTML = "Please Enter the start date:";

    document.getElementById("managerView").hidden = true;
    document.getElementById("dateSelectors").hidden = false;
    document.getElementById("hideMe").hidden = false;
    document.getElementById("dateSelectors").value = SALES;
});

/**
 * An object that represents the "Submit Dates" button in the Manager GUI. Its correponding event listener will be triggered when the button is clicked. 
 * @type {HTML}
 */
const submitDates = document.getElementById("submitDates");
submitDates.addEventListener('click', function(e) {
    // IMPORTANT: Check if the "Submit Dates" button was clicked 
    // because the manager wanted a sales report:
    submitDateLogic();
});

/**
 * Will compare two strings of dates and return true if start date is a prior date to end date
 * @author Octavio Almanza
 * @param {String} startDate a string of the form YYYY-MM-DD 
 * @param {String} endDate a string of the form YYYY-MM-DD
 * @returns {boolean} Will return true if endDate is a date after or the same date as startDate. Will return false otherwise.
 */
function checkIfValidDates(startDate, endDate){
    // split() will create an array of { year, month, day }
    let start = startDate?.split("-");
    let end = endDate?.split("-");

    // Check the years:
    if (end[0] > start[0]){
        return true;
    }else if (parseInt(end[0]) == parseInt(start[0])){
        // If the years are equal, check months:
        if (parseInt(end[1]) > parseInt(start[1])){
            return true;

        }else if (parseInt(end[1]) == parseInt(start[1])){
            // If the years and months are equal, check days:
            if (end[2] >= start[2]){
                return true;
            }
        }
    }

    return false;
}

/**
 * A function that reads in the values of datePanel1 and datePanel2, and will call a specific function based on the dateSelector div's value.
 * @author Octavio Almanza
 */
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

/**
 * Will return an HTML string representing the Sales Report output 
 * @author Octavio Almanza
 * @param {Array} data a two dimmensional array containing menu items, their sales, and profit over the given interval
 * @param {String} startDate a string of the form YYYY-MM-DD
 * @param {String} endDate a string of the form YYYY-MM-DD
 * @returns {String} a string containing a title and a table with the columns "Item Name", "Sales", and "Profit" headings 
 */

function salesReport(data, startDate, endDate){
    salesTable = '<div id="salesReport" class="reportContainer"><p id = "salesReportTitle" class="reportTitle">Sales Report from ' + startDate + ' to ' + endDate + '</p><table class="reportTable"><tbody><tr>';
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
        salesTable = salesTable + "<td>$" + data.result[i].profit + "</td>";
        salesTable = salesTable + "</tr>"
    }
    
    salesTable = salesTable + '</tbody></table></div>'
    return salesTable;
}

/**
 * The function responsible for displaying the Sales Report in the Manager GUI.
 * @author Octavio Almanza
 * @param {String} startDate A String variable that stores a date in the form "YYYY-MM-DD"
 * @param {String} endDate A String variable that stores a date in the form "YYYY-MM-DD"
 */

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
        
        htmlSalesRep = salesReport(data, startDate, endDate);
        console.log(htmlSalesRep);
        content = document.getElementById("managerView");
        content.innerHTML = htmlSalesRep;

    }).catch(function(error) {
        console.log(error);
    }
);}

/**
 * A function that creates a two dimmensional array containing every menu item in the database and its respective values.
 * @returns A two dimmensional array containing
 */
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

/**
 * A function that will return all of the orders between two dates.
 * @author Octavio Almanza
 * @param {String} startDate A String variable that stores a date in the form "YYYY-MM-DD"
 * @param {String} endDate A String variable that stores a date in the form "YYYY-MM-DD"
 * @returns A two dimmensional array containing all orders within the given time interval
 */
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
/**
 * An object representing the "Popular Menu Item Report" button in the Manager GUI
 * @type {HTML}
 */
const createPopMenuItemReport = document.getElementById("popMenuItemButton");
createPopMenuItemReport.addEventListener('click', function(e){
    document.getElementById("reportType").innerHTML = "Popular Menu Items Report";
    document.getElementById("instructStartDate").innerHTML = "Please Enter the start date:";

    document.getElementById("dateSelectors").value = POPITEMS;
    document.getElementById("dateSelectors").hidden = false;
    document.getElementById("hideMe").hidden = false;
    document.getElementById("managerView").hidden = true;
});

/**
 * Will take an array representing an order
 * @author Octavio Almanza
 * @param {Array} curr_order 
 * @returns {Array} An array containing all of the unique menu items in an order
 */
function removeDuplicateItems(curr_order){
    uniqueItems = Array();
    for (let i = 0; i < curr_order?.['item'].length; i++){
        if (!uniqueItems.includes(curr_order?.['item'][i])){
            uniqueItems.push(curr_order?.['item'][i]);
        }
    }
    return uniqueItems;
}

/**
 * Creates a two dimmensional array of type Number and size maxItem by maxItem with all values set to 0. The function returns the return value of updateHashMap(...)
 * @author Octavio Almanza
 * @param {Array} orders A two dimmensional array of orders
 * @param {Number} maxItem The current greatest Menu ID
 * @returns a populated hash map where each index represents a combination of items and each element corresponds to the number of that combination sold.
 */
function makeEmptyArr(orders, maxItem){
    arr = Array(maxItem);

    for (let i = 0; i < arr.length; i++){
        arr[i] = Array(maxItem).fill(0);
    }

    return updateHashMap(orders, arr, maxItem);
}

/**
 * Populate a hash map to reflect the quantity of each possible combination of items sold.
 * @author Octavio Almanza
 * @param {Array} orders An array of orders
 * @param {Array} hashMap A two dimmensional array with all values set to 0
 * @returns a populated hash map where each index represents a combination of items and each element corresponds to the number of that combination sold.
 */
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

/**
 * @author Octavio Almanza
 * @param {String} startDate a string of the form YYYY-MM-DD 
 * @param {String} endDate a string of the form YYYY-MM-DD 
 * @param {Array} menuItemsAndQtyArr An array where each element contains two menu item names and the quantity that combination sold
 * @param {Number} maxItems The greatest ID currently in the menu items table
 */
function displayPopItems(startDate, endDate, menuItemsAndQtyArr, maxItems){
    htmlStr = '<div id="popMenuItems" class="reportContainer"><p class="reportTitle">Popular Item Pairs from ' + startDate + ' to ' + endDate + '</p>';
    htmlStr = htmlStr + '<table class="reportTable"><tr id = "titleRow">';
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

/**
 * @author Octavio Almanza
 * @param {Array} hashMap A two dimmensional array that keeps track of the number of menu items
 * @param {Array} menuItems An array containing an element for each menu item and each element contains a menu item's respective information
 * @returns An array where each element contains two menu item names and the quantity that combination sold

 */
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

/**
 * @author Octavio Almanza
 * @param {Array} item1 An array where the first two elements are Strings representing two menu item names and a Number representing the quantity that combination sold
 * @param {Array} item2 An array where the first two elements are Strings representing two menu item names and a Number representing the quantity that combination sold
 * @returns Returns -1 if item1 has a greater value at index 2 than item2. Returns 1 if item2 has a greater value at index 2 than item1. Returns 0 otherwise.
 */
function compareQtySold( item1, item2 ){
    if (item1[2] > item2[2]){
        return -1;
    }
    if (item1[2] < item2[2]){
        return 1;
    }
    return 0;
}

/**
 * Contains the logic corresponding to displaying the popular menu item report in the Manager View
 * @author Octavio Almanza
 * @param {String} startDate A string of the form YYYY-MM-DD 
 * @param {String} endDate A string of the form YYYY-MM-DD 
 */
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
    document.getElementById("reportType").innerHTML = "Restock Report";
    document.getElementById("instructStartDate").innerHTML = "Please Enter the start date:";

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
        
        htmlRestockRep = restockReport(data, startDate, endDate);
        console.log(htmlRestockRep);
        content = document.getElementById("managerView");
        content.innerHTML = htmlRestockRep;

    }).catch(function(error) {
        console.log(error);
    }
);}

function restockReport(data, startDate, endDate){
    restockTable = '<div class="reportContainer"><p class="reportTitle">Restock Report from ' + startDate + ' to ' + endDate + '</p><table class="reportTable"><tbody><tr>';
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

    restockTable = restockTable + '</tbody></table></div>'
    return restockTable;
}

/********************** EXCESS REPORT *******************************/

// Excess Report - Given a timestamp, display the list of items that only sold less than 10% of their inventory between the timestamp and the current time, assuming no restocks have happened during the window.
const createExcessReport = document.getElementById("excessReportButton");

createExcessReport.addEventListener('click', function(e) {
    document.getElementById("reportType").innerHTML = "Excess Report";
    document.getElementById("instructStartDate").innerHTML = "Enter a Date:";

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
        
        htmlExcessRep = excessReport(data, startDate);
        console.log(htmlExcessRep);
        content = document.getElementById("managerView");
        content.innerHTML = htmlExcessRep;

    }).catch(function(error) {
        console.log(error);
    }
);}

function excessReport(data, startDate){
    excessTable = '<div class="reportContainer" id="excessReportContainer"><p id="excessReportTitle" class="reportTitle">Excess Report for ' + startDate + '</p><table class="reportTable"><tbody><tr>';
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
    
    excessTable = excessTable + '</tbody></table></div>'
    return excessTable;
}

/************************ Inventory Table Modification ****************************/

// If they change the name of an item, we have to update its name in the inventory table
// AND ALSO modify its name in the menu item table (it's the same item, just different name)
    // This could be done with array_replace(ARR, ELEMENT_TO_REPLACE, REPLACEMENT)
    // OR
    // array_remove(ARR, ELEMENT_TO_REMOVE) then array_append(ARR, NEW_ELEMENT);

// A drop down would be cool to select the Units, but that can come in later

/**
 * Iterates through the inventory table that the manager modified and will update the table appropriately
 * @author Octavio Almanza
 */
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
    alert("Inventory Table has been Updated");
}

/**
 * The function will change the ingredient list of every menu item that contains the oldName of an inventory item to reflect the newName of the inventory item.
 * @author Octavio Almanza
 * @param {String} oldName The old name of a inventory item. Stored when the user clicks on "View Inventory"
 * @param {String} newName The new modified name of the inventory item. Can be obtained by checking the text value in HTML
 */
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

/******************** INGREDIENT CHECKBOX STUFF ***************************** */

/**
 * Creates an HTML table that enables the selection of all of the inventory items available. The table will have the current ingredients of the menuItem argument checked and reflect their respective quantity
 * @author Octavio Almanza
 * @param {Array} menuItem An array that stores the properties of a specific menu item
 * @param {Array} data A multidimmensional array obtained from the "/getInv" GET function. Stores all of the inventory items
 * @returns {String} An HTML table in the form of a string.
 */
function makeIngredientCheckbox (menuItem, data) {
    let htmlStr = '<div id="ingredientSelector"><table class="ingredientSelectTable" id="ingredientSelectTable' + menuItem.menu_id + '">';

    for (let i = 0; i < data.result.length; i++){
        let itemid = data.result[i].itemid;
        let count = 0;
        let checked = "";

        if (i%2 == 0){
            htmlStr = htmlStr + "<tr>";
        }

        if (menuItem.ingredient_list.includes(itemid)){ 
            console.log(checked);
            checked = "checked";
            for (let j = 0; j < menuItem.ingredient_list?.length; j++){
                if (menuItem.ingredient_list[j] == itemid){
                    count++;
                }
            }
        }

        htmlStr = htmlStr + '<td><input type="checkbox" id="' + itemid + '" name="' + itemid + '"' + checked + ' value="yes">';
        htmlStr = htmlStr + '<label for="' + itemid + '">' + itemid + '</label>';
        htmlStr = htmlStr + '<input type="number" min="1" class="numInput" value="' + count + '"id="' + itemid+ 'Qty"></input></td>';

        if (i%2 == 1 || i == data.result.length){
            htmlStr = htmlStr + "</tr>";
        }
    }

    htmlStr = htmlStr + '</table><button id="ingSelectButton" onclick="getSelectedIngredients(' + menuItem.menu_id + ')">Select Ingredients</button></div>'
    return htmlStr;
}

/**
 * Displays the ingredient checkbox for a specific menu item to enable the manager to modify the ingredients.
 * @author Octavio Almanza
 * @param {Number} menuID 
 */
async function populateIngredientCheckbox(menuID){
    let menuItems = await getMenuItemArray();
    fetch('/getInv', {method: 'GET'})
        .then(function(response) {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
            .then(function(data) {
            // TODO: Modify HTML using the information received from the database
            // data contains the array
            content = document.getElementById("ingredientsFor" + menuID);
            ingCheckbox = makeIngredientCheckbox(menuItems[menuID-1], data);
            content.innerHTML = ingCheckbox;
        })
        .catch(function(error) {
            console.log(error);
    });
}

/**
 * Will check the ingredient selector of the menu item with the corresponding menu id and update the ingredients locally.
 * @author Octavio Almanza
 * @param {Number} menuID 
 */
function getSelectedIngredients(menuID){
    var table = document.getElementById("ingredientSelectTable"+menuID);
    var ingredientArr = [];
    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {

            let checkbox = col.querySelector("input");
            let value = document.getElementById(checkbox.id+"Qty").value;

            if (checkbox.checked){
                for (let k = 0; k < value; k++){
                    ingredientArr.push(checkbox.id);
                }
            }
        }  
    }

    console.log("Selected Ingredients: " + ingredientArr);
    if (ingredientArr.length == 0){
        console.log("Ingredient select is empty");
    };
    content = document.getElementById("ingredientsFor" + menuID);
    content.innerHTML = '<div id="ingredientsFor' + menuID + '">' + prettyArrayStr(ingredientArr) + '<button class="editIngButtons" id="editMenu'+ menuID +'" onclick="populateIngredientCheckbox('+ menuID + ')">Edit</button></div>'
}

/********************** GOOGLE **********************/

/**
 * Initializes the Google Translate API to enable the manager to change languages
 */
function googleTranslateElementInit(){
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
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


  /******************************* Delete Inventory ************************/
  const  deleteInventoryItemButton = document.getElementById("deleteInventoryItemButton");

deleteInventoryItemButton.addEventListener('click', function(e) {
  console.log('inventory delete was clicked');
  const ID = prompt("What is the inventory ID?", "bacon");
  if(ID == null || ID == ""){
    alert("delete menu item was canceled");
  } else{
    const inventoryID = ID.toLowerCase();
    const data = {inventoryID};

    if (confirm("Are you suer that you want to delete item: " + ID)){
        fetch('/deleteInventoryItem', {
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


/******************* UPDATE PICTURE ***********************/
function makePictureTable(data){    
    pictureTable = '<div id="tableAndUpdateButton"> <table id="pictureTable"> <tr id = "titleRow">';
    pictureTable = pictureTable + "<th>Menu ID</th>";
    pictureTable = pictureTable + "<th>Item Name</th>";
    pictureTable = pictureTable + "<th>Image URL</th>";
    pictureTable = pictureTable + "<th>Item Picture</th>";
    pictureTable = pictureTable + "</tr>";

    currColor = "grey";
    for (let i = 0; i < data.result.length; i++){
        if (i%2){
            currColor = "lightgray";
        }else{
            currColor = "white";
        }

        pictureTable = pictureTable + '<tr id = "menuItem" style="background-color:' + currColor + '">';
        pictureTable = pictureTable + '<td>'+ data.result[i].menu_id + "</td>";
        pictureTable = pictureTable + '<td>'+ data.result[i].item_name + "</td>";
        pictureTable = pictureTable + '<td contenteditable="true" id="imageLink">' + data.result[i].image_url + "</td>";
        pictureTable = pictureTable + '<td class="imgContainer">' + "<img src = '"+data.result[i].image_url+"'>" + "</td>";
        pictureTable = pictureTable + "</tr>";
    }
    pictureTable = pictureTable + '</table><button id="updatePictureTable" onClick="updatePicture()">Update Table</button></div>';
    return pictureTable;
}


const  updateMenuItemButton = document.getElementById("updateMenuItemButton");

updateMenuItemButton.addEventListener('click', function(e) {
  console.log('update menu was clicked');
  
  fetch('/getMenu', {method: 'GET'})
        .then(function(response) {
            if(response.ok) return response.json();
            throw new Error('Request failed.');
        })
            .then(function(data) {
            // TODO: Modify HTML using the information received from the database
            content = document.getElementById("managerView");
            pictureTable = makePictureTable(data);
            content.innerHTML = pictureTable;

            console.log(data.result);
        })
        .catch(function(error) {
            console.log(error);
    });
  
});

async function updatePicture(){
    // Revert back to english:
    var picTable = document.getElementById("pictureTable");
    for (let i = 1, row; row = picTable.rows[i]; i++){
        // iterating through rows. Starting at row 1 bc 0 is headers
        menu_id = -1;
        item_name = "";
        image_url = "";
        for (let j = 0, col; col = row.cells[j]; j++){
            if (j == 0){ menu_id = col.textContent; }
            else if (j == 1){ item_name = col.textContent; }
            else if (j == 2){ image_url = col.textContent; }
            else { break; }
        }

        const data = {menu_id, item_name, image_url};
        console.log(data);
        x = await fetchPost('/updatePicture', data);
        
    }
}
function goHome(){
    document.getElementById("dateSelectors").hidden = true;
    let view = document.getElementById("managerView");
    view.hidden = false;
    
    let homeHTML = '<p>Welcome, Manager</p><!--The div element for the map --><div id="map"></div>';
    view.innerHTML=homeHTML;

    initMap();
}
