const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const server = require(__dirname + '/public/javascript/ServerGUI.js');

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

