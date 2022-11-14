const { query } = require('express');
const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const app = express();
const port = 3000;

const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.json({extended: true, limit: '1mb'}))


app.post('/serverSubmit', async (req, res) => {
    console.log("inside server");
    const { order_items, order_prices } = req.body;

    // Getting Date Made
    let dateobj = new Date();
    var myDate = dateobj.toISOString().split('T')[0];

    // Getting Week Day
    var day = 'X';
    var day_num = dateobj.getDay();
    switch(day_num){
        case 0:
            day = 'U';
            break;
        case 1:
            day = 'M';
            break;
        case 2:
            day = 'T';
            break;
        case 3:
            day = 'W';
            break;
        case 4:
            day = 'H';
            break;
        case 5:
            day = 'F';
            break;
        case 6:
            day = 'S';
            break;
        default:
            day = 'X';
            break;
    }
  
    // Getting next Order ID
    var order_id = 0;
    await pool.query('select MAX(order_id) from orders;')
    .then(query_res => {
        order_id = query_res.rows[0].max;
        order_id += 1;
    });


    // Inputing Orders
    for(let i = 0; i<order_items.length; i++){
        await pool.query("INSERT INTO orders(order_id, order_total, item, date_made, day_made) VALUES ("+order_id+", "+order_prices[i]+", "+order_items[i]+", '"+myDate+"', '"+day+"');").then(query_res => {});
    }

    res.status(200).json({ order_items, order_prices});
});


app.get('/', function(req, res) {
    res.render('index');
});

app.get('/customergui', (req, res) => {
    res.render('CustomerGUI/Customer');
});

app.get('/customerorder', (req, res) => {
    res.render('CustomerGUI/CustomerOrder');
});

app.get('/servergui', (req, res) => {
    res.render('ServerGUI/Server');
});

app.get('/managergui', (req, res) => {
    res.render('ManagerGUI/Manager');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(__dirname);
});


// app.post() updates state on the server
// app.get() receives information form the server

app.get('/getMenu', (req, res) => {
    menu_items = [];
    pool
        .query('select * from menu_items order by menu_id;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            data = { result : menu_items };
            console.log("Query done");
            res.json(data);
        }
    );
});

app.get('/getInv', (req, res) => {
    inv_items = [];
    pool
        .query('select * from inventory order by itemid;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inv_items.push(query_res.rows[i]);
            }
            data = { result : inv_items };
            console.log("Query done");
            res.json(data);
        }
    );
});

// To get entrees
app.get('/getEntree', (req, res) => {
    menu_items = [];
    pool
        // SQL query is not 100% CORRECT, should display type but does not...
        .query("SELECT menu_id, item_name, item_price, type FROM menu_items WHERE type = 'entree';")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            data = { result : menu_items };
            console.log("Query done");
            res.json(data);
        }
    );
});

// To get sides
app.get('/getSide', (req, res) => {
    menu_items = [];
    pool
        // SQL query is not 100% CORRECT, should display type but does not...
        .query("SELECT menu_id, item_name, item_price, type FROM menu_items WHERE type = 'side';")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            data = { result : menu_items };
            console.log("Query done");
            res.json(data);
        }
    );
});

// To get drinks
app.get('/getDrink', (req, res) => {
    menu_items = [];
    pool
        // SQL query is not 100% CORRECT, should display type but does not...
        .query("SELECT menu_id, item_name, item_price, type FROM menu_items WHERE type = 'drink';")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            data = { result : menu_items };
            console.log("Query done");
            res.json(data);
        }
    );
});


// To get dessert
app.get('/getDessert', (req, res) => {
    menu_items = [];
    pool
        // SQL query is not 100% CORRECT, should display type but does not...
        .query("SELECT menu_id, item_name, item_price, type FROM menu_items WHERE type = 'dessert';")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu_items.push(query_res.rows[i]);
            }
            data = { result : menu_items };
            console.log("Query done");
            res.json(data);
        }
    );
});

app.post('/addMenuItem', (req, res) => {
    console.log("inside add Menu item");
    const { menuID, menuName,menuPrice,menuIngredients, menuIngNum, menuType } = req.body;
    console.log(req.body);
  
    console.log("before the query");
    // Database Code here
    const queryString = "INSERT INTO menu_items ( menu_id , item_name , item_price , num_ingredients, ingredient_list, type ) VALUES( " + menuID + ", '" + menuName + "', " + menuPrice + ", " + menuIngNum + ", '" + menuIngredients + "', '" + menuType + "');";
    console.log(queryString);
    pool
        .query(queryString)
        .then(query_res => {
        // for (let i = 0; i < query_res.rowCount; i++){
        //     console.log(query_res.rows[i]);
        // }
        console.log("item added");
    })

    res.status(200).json({ menuID, menuName,menuPrice,menuIngredients, menuIngNum, menuType });
});

app.post('/updateMenuPriceItem', (req, res) => {
    console.log("inside update Menu item");
    const { menuID, menuPrice } = req.body;
    console.log(req.body);
  
    // Database Code here
    const queryString = "UPDATE menu_items SET item_price= '" + menuPrice +"' WHERE menu_id= '" + menuID +"';";
    console.log(queryString);
     pool
        .query(queryString)
        .then(query_res => {
        // for (let i = 0; i < query_res.rowCount; i++){
        //     console.log(query_res.rows[i]);
        // }
    })

    res.status(200).json({ menuID, menuPrice });
});

app.post('/updateMenuNameItem', (req, res) => {
    console.log("inside update Menu item");
    const { menuID, menuName } = req.body;
    console.log(req.body);
  
    // Database Code here
    const queryString = "UPDATE menu_items SET item_name= '" + menuName +"' WHERE menu_id= '" + menuID +"';";
    console.log(queryString);
     pool
        .query(queryString)
        .then(query_res => {
        // for (let i = 0; i < query_res.rowCount; i++){
        //     console.log(query_res.rows[i]);
        // }
    })

    res.status(200).json({ menuID, menuName });
});

app.post('/deleteMenuItem', (req, res) => {
    console.log("inside update Menu item");
    const { menuID } = req.body;
    console.log(req.body);
  
    // Database Code here
    const queryString = "DELETE FROM menu_items WHERE menu_id= '" + menuID + "';";
    console.log(queryString);
    pool
        .query(queryString)
        .then(query_res => {
        // for (let i = 0; i < query_res.rowCount; i++){
        //     console.log(query_res.rows[i]);
        // }
    })

    res.status(200).json({ menuID });
});

app.post('/addInventoryItem', (req, res) => {
    console.log("inside add inveneotry item");
    const { inventoryID, inventoryStockprice, inventoryUnits, inventoryQuantity, inventoryServingSize, inventoryNeeded } = req.body;
    console.log(req.body);
  
    console.log("before the query");
    // Database Code here
    const queryString = "INSERT INTO inventory ( itemid , stockprice , unit , quantity, serving_size, quantity_needed ) VALUES( '" + inventoryID + "', " + inventoryStockprice + ", '" + inventoryUnits + "', " + inventoryQuantity + ", " + inventoryServingSize + ", " + inventoryNeeded + ");";
    console.log(queryString);
    pool
        .query(queryString)
        .then(query_res => {
            console.log("item added");
    })

    res.status(200).json({ inventoryID, inventoryStockprice, inventoryUnits, inventoryQuantity, inventoryServingSize, inventoryNeeded });
});

app.post('/orderInventoryItem', (req, res) => {
    console.log("inside update inventory item");
    const { inventoryID, inventoryQuantity } = req.body;
    console.log(req.body);
  
    // Database Code here
    const queryString = "UPDATE inventory SET quantity= '" + inventoryQuantity +"' WHERE itemid= '" + inventoryID +"';";
    console.log(queryString);
    console.log(queryString);
     pool
        .query(queryString)
        .then(query_res => {
    })

    res.status(200).json({ inventoryID, inventoryQuantity });
});