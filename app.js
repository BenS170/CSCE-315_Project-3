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


app.post('/serverSubmit', (req, res) => {
    console.log("inside server");
    const { testObj, orderObj } = req.body;
    console.log(orderObj.name);
    console.log(orderObj.price);
  
    // Database Code here
    pool.query('select * from orders where order_id<'+testObj+';')
    .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            console.log(query_res.rows[i]);
        }
    })

    res.status(200).json({ testObj});
});


app.get('/', function(req, res) {
    res.render('index');
});

app.get('/customergui', (req, res) => {
    res.render('CustomerGUI/Customer');
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