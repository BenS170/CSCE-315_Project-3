

// menu functions
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




// inventory functions
async function viewInventory(){
    alert("view inventory");

}

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
