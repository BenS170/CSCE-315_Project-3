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

app.get('/customergui', function(req, res) {
    res.render('CustomerGUI/Customer');
});

app.get('/servergui', function(req, res) {
    res.render('ServerGUI/Server');
});

app.get('/managergui', function(req, res) {
    res.render('ManagerGUI/Manager');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

app.get('/getMenu', (req, res) => {
    menu_items = [];
    pool
        .query('select * from menu_items;')
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
    pool
        .query("INSERT INTO menu_items ( menu_id , item_name , item_price , num_ingredients, ingredient_list,type ) VALUES( " + menuID + ", '" + menuName + "', " + menuPrice + ", " + menuIngNum + ", " + menuIngredients + + ", '" + menuType + "');")
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
    const { ID, price } = req.body;
    console.log(req.body);
  
    // Database Code here
     pool
        .query("UPDATE menu_items SET item_price= '" + price +"' WHERE menu_id= '" + ID +"';")
        .then(query_res => {
        // for (let i = 0; i < query_res.rowCount; i++){
        //     console.log(query_res.rows[i]);
        // }
        alert("item updated");
    })

    res.status(200).json({ ID, price });
});

app.post('/deleteMenuItem', (req, res) => {
    console.log("inside update Menu item");
    const { menuID } = req.body;
    console.log(req.body);
  
    // Database Code here
    pool
        .query("DELETE FROM menu_items WHERE menu_id= '" + menuID + "';")
        .then(query_res => {
        // for (let i = 0; i < query_res.rowCount; i++){
        //     console.log(query_res.rows[i]);
        // }
        alert("item deleted");
    })

    res.status(200).json({ menuID });
});