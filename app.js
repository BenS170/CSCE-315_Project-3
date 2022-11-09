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

app.post('/updateMenuItem', (req, res) => {
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