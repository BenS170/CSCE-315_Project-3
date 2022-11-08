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

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/customergui', (req, res) => {
    res.render('CustomerGUI/Customer');
});

app.get('/servergui', (req, res) => {
    const data = {pool:pool};
    res.render('ServerGUI/Server', data);
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