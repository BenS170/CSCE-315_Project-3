const express = require('express');
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static('public'));

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