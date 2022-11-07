
// menu functions
async function viewMenu(){
    alert("view menu");
    
    //const results = await pool.query("select * from menu_items");
    const contentId = document.getElementById('currContent');
    contentId.hidden = false;
    contentId.innerHTML = '<span style="background-color: lime" id = "cool">Replacement HTML</span>';

    //return results.rows;
}

function addMenuItem(){
    const contentId = document.getElementById('cool');
    contentId.hidden = true;
    contentId.innerHTML = '<span style="background-color: blue" id = "currContent">Bruh</span>';
}

function updateMenu(){
    alert("update menu");

}

function deleteMenuItem(){
    alert("delete menu");

}


// inventory functions
function viewInventory(){
    alert("view inventory");

}

function orderInventory(){
    alert("order inventory");

}

function addInventoryItem(){
    alert("add inventory");

}


// manager reports
function salesReport(){
    alert("sales report");

}

function popularMenuReport(){
    alert("popular report");

}

function excessReport(){
    alert("excess report");

}

function restockReport(){
    alert("restock report");

}