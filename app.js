const { query, json } = require('express');
const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const session = require('express-session');

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
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));
app.use(express.static('public'));
app.use(express.json({extended: true, limit: '1mb'}))


// Passport Setup
const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Google AUTH

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '423217933208-4kho4js0167unhr69r9h5rjg0n7gq3u1.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://three15-team-3.onrender.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/managergui');
  });

  

/**
 * Adds a menu item to the order summary.
 * @post
 * @param {Array} order_items - Array of integers that represent the ids of item in the order
 * @param {Array} order_prices - Array of Floats that contain the price of the items in the order.
 */
app.post('/serverSubmit', async (req, res) => {
    console.log("inside server");
    const { order_items, order_prices, } = req.body;

    // Getting Date Made
    let dateobj = new Date();
    dateobj.toLocaleString('en-US', { timeZone: 'America/New_York' });
    var myDate = dateobj.toISOString().split('T')[0];
    console.log(dateobj.toISOString());

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
    var order_ID = 0;
    await pool.query('select MAX(order_id) from orders;')
    .then(query_res => {
        order_ID = query_res.rows[0].max;
        order_ID += 1;
    });


    // Inputing Orders
    for(let i = 0; i<order_items.length; i++){
        var ingredients = [];

        // removing ingredients
        await pool
            .query("SELECT ingredient_list FROM menu_items WHERE menu_id="+order_items[i]+";")
            .then(query_res => {
                for (let i = 0; i < query_res.rows[0]["ingredient_list"].length; i++){
                    var res = query_res.rows[0]["ingredient_list"][i];
                    ingredients.push(res);
                }
            }
        );
        
        //checking for available inventory
        var out_of_inventory = false;

        for(let i = 0; i<ingredients.length; i++){
            await pool
                .query("SELECT quantity, serving_size FROM inventory WHERE itemid='"+ingredients[i]+"';")
                .then(query_res => {
                    var quantity = query_res.rows[0]["quantity"];
                    var serving_size = query_res.rows[0]["serving_size"];
                    console.log(quantity);
                    console.log(serving_size);
                    if(quantity-serving_size < 0){
                        out_of_inventory = true;
                    }
                });
        }


        if(!out_of_inventory){
            for(let i = 0; i<ingredients.length; i++){
                console.log("UPDATE inventory SET quantity=quantity-serving_size WHERE itemid='"+ingredients[i]+"';");
                await pool.query("UPDATE inventory SET quantity=quantity-serving_size WHERE itemid='"+ingredients[i]+"';").then(query_res => {});
            }
            await pool.query("INSERT INTO orders(order_id, order_total, item, date_made, day_made) VALUES ("+order_ID+", "+order_prices[i]+", "+order_items[i]+", '"+myDate+"', '"+day+"');").then(query_res => {});
        }


    }

    res.status(200).json({ order_items, order_prices});
});



app.post('/customerSubmit', async (req, res) => {
    console.log("inside customer");
    const { order_items, order_prices, order_quantity } = req.body;

    // Getting Date Made
    let dateobj = new Date();
    dateobj.toLocaleString('en-US', { timeZone: 'America/New_York' });
    var myDate = dateobj.toISOString().split('T')[0];
    console.log(dateobj.toISOString());

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
    var order_ID = 0;
    await pool.query('select MAX(order_id) from orders;')
    .then(query_res => {
        order_ID = query_res.rows[0].max;
        order_ID += 1;
    });



    // Inputing Orders
    for(let i = 0; i<order_items.length; i++){
        for (let j = 0; j < order_quantity[i];j++){
            
            var ingredients = [];

            // deducting ingredients from inventory
            await pool
                .query("SELECT ingredient_list FROM menu_items WHERE menu_id="+order_items[i]+";")
                .then(query_res => {
                    for (let i = 0; i < query_res.rows[0]["ingredient_list"].length; i++){
                        var res = query_res.rows[0]["ingredient_list"][i];
                        /*if(i!=0){
                            res = query_res.rows[0]["ingredient_list"][i].slice(1);
                        }*/
                        ingredients.push(res);
                    }
                }
            );
    
            //checking for available inventory
            var out_of_inventory = false;

            for(let i = 0; i<ingredients.length; i++){
                await pool
                    .query("SELECT quantity, serving_size FROM inventory WHERE itemid='"+ingredients[i]+"';")
                    .then(query_res => {
                        var quantity = query_res.rows[0]["quantity"];
                        var serving_size = query_res.rows[0]["serving_size"];
                        console.log(quantity);
                        console.log(serving_size);
                        if(quantity-serving_size < 0){
                            out_of_inventory = true;
                        }
                    });
            }


            if(!out_of_inventory){
                for(let i = 0; i<ingredients.length; i++){
                    console.log("UPDATE inventory SET quantity=quantity-serving_size WHERE itemid='"+ingredients[i]+"';");
                    await pool.query("UPDATE inventory SET quantity=quantity-serving_size WHERE itemid='"+ingredients[i]+"';").then(query_res => {});
                }
                await pool.query("INSERT INTO orders(order_id, order_total, item, date_made, day_made) VALUES ("+order_ID+", "+order_prices[i]+", "+order_items[i]+", '"+myDate+"', '"+day+"');").then(query_res => {});
            }

        }
    }

    res.status(200).json({ order_items, order_prices});
});



app.get('/', function(req, res) {
    res.render('index');
});

app.get('/auth', function(req,res){
    res.render('pages/auth');
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
        .query("SELECT menu_id, image_url, item_name, item_price, type FROM menu_items WHERE type = 'entree';")
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
        .query("SELECT menu_id, image_url, item_name, item_price, type FROM menu_items WHERE type = 'side';")
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
        .query("SELECT menu_id, image_url, item_name, item_price, type FROM menu_items WHERE type = 'drink';")
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
        .query("SELECT menu_id, image_url, item_name, item_price, type FROM menu_items WHERE type = 'dessert';")
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

app.post('/getSalesRep', (req, res) => {
    console.log("Inside getSalesRep");
    const { startDate, endDate } = req.body;
    console.log(req.body);

    sales = [];
    // Database Code here
    const queryString = "SELECT T1.item_name, T1.sales, ROUND(T1.sales*T2.item_price::numeric, 2) AS profit FROM (SELECT item_name, COUNT(item) as sales FROM orders INNER JOIN menu_items on menu_items.menu_id = orders.item WHERE orders.date_made >= '" + startDate + "' AND orders.date_made <= '" + endDate + "' GROUP BY menu_items.item_name) AS T1 JOIN(SELECT item_name, item_price FROM menu_items) as T2 ON T1.item_name = T2.item_name";
    pool
        .query(queryString)
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sales.push(query_res.rows[i]);
            }
            data = { result : sales };
            res.json(data);
    })
});

app.post('/getOrdersBetweenDates', (req, res) => {
    console.log("Inside getOrdersBetweenDates");
    const { startDate, endDate } = req.body;
    console.log(req.body);

    orders = [];
    // Database Code here
    const queryString = "SELECT * FROM orders WHERE '" + startDate + "' <= date_made AND date_made <= '" + endDate + "' order by order_id";
    console.log(queryString);
    pool.query(queryString)
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                orders.push(query_res.rows[i]);
            }
            data = { result : orders };
            res.json(data);
        })
    }
);

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

function toSQLArr(str){
    arr = "" + str;
    arr = arr.split(",")
    var arrStr = "'{";
    for (let i = 0; i < arr.length; i++){
        let str = "";
        let firstChar = false;
        for (let j = 0; j < arr[i].length; j++){
            if (arr[i].charAt(j) == " " && !firstChar){
                continue;                
            }
            firstChar = true;
            str = str + arr[i].charAt(j);
        }
        // The last item in the ingredient list will have "Edit" due to the edit button. 
        // We have to remove it! before it goes back to the database
        arrStr+= '"' + str.replaceAll("Edit","") + '"'
        if (i != arr.length-1){
            arrStr += ", "
        }
    }
    return arrStr + "}'";
}

app.post('/updateMenuItem', (req, res) => {
    const {menu_id, item_name, item_price, num_ingredients, ingredient_list, type} = req.body;
    
    // Database Code here
    var queryString = "UPDATE menu_items SET item_name='" + item_name + "', ";
    queryString += "item_price= '" + item_price.slice(1) + "', ";
    queryString += "num_ingredients= '" + num_ingredients + "', ";
    queryString += "ingredient_list=" + toSQLArr(ingredient_list) + ", ";
    queryString += "type= '" + type + "' ";
    queryString += "WHERE menu_id= '" + menu_id + "';";
    console.log(queryString + "\n");
    pool
        .query(queryString)
        .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            console.log(query_res.rows[i]);
        }
    })

    res.status(200).json({menu_id, item_name, item_price, num_ingredients, ingredient_list, type});
});


app.post('/getRestockRep', (req, res) => {
    console.log("Inside getRestockRep");
    const { startDate, endDate } = req.body;
    console.log(req.body);

    restock = [];
    // Database Code here
    const queryString = "SELECT T1.itemid, T1.servings_sold, T2.servings_needed, T2.servings_left FROM (SELECT inventory.itemid, COUNT(orders.order_id) as servings_sold FROM orders INNER JOIN menu_items ON orders.item = menu_items.menu_id INNER JOIN inventory ON inventory.itemid = ANY(menu_items.ingredient_list) WHERE orders.date_made >= '"+startDate+"' AND orders.date_made<='"+endDate+"' AND inventory.itemid = ANY(menu_items.ingredient_list) GROUP BY inventory.itemid) AS T1 JOIN (SELECT itemid, CEIL(quantity_needed/serving_size) as servings_needed, CEIL(quantity/serving_size) as servings_left from inventory) AS T2 ON T1.itemid = T2.itemid;";
    pool
        .query(queryString)
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                restock.push(query_res.rows[i]);
            }
            data = { result : restock };
            res.json(data);
    })
});

app.post('/getExcessRep', (req, res) => {
    console.log("Inside getExcessRep");
    const { startDate } = req.body;
    console.log(req.body);

    excess = [];
    // Database Code here
    const queryString = "SELECT T1.itemid, ROUND(T1.servings_sold*T2.serving_size::numeric, 3) as quantity_sold, ROUND(T2.quantity::numeric, 3) as quantity FROM (SELECT inventory.itemid, COUNT(orders.order_id) as servings_sold FROM orders INNER JOIN menu_items ON orders.item = menu_items.menu_id INNER JOIN inventory ON inventory.itemid = ANY(menu_items.ingredient_list) WHERE orders.date_made >= '"+ startDate +"' AND inventory.itemid = ANY(menu_items.ingredient_list) GROUP BY inventory.itemid) AS T1 JOIN (SELECT * from inventory) AS T2 ON T1.itemid = T2.itemid WHERE (T1.servings_sold*T2.serving_size)/(T1.servings_sold*T2.serving_size+T2.quantity)<0.10;";
    pool
        .query(queryString)
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                excess.push(query_res.rows[i]);
            }
            data = { result : excess };
            res.json(data);
    })
});

app.post('/updateInvItem', (req, res) => {
    const {itemid, stockprice, unit, quantity, serving_size, oldName} = req.body;

    // Database Code here
    var queryString = "UPDATE inventory SET itemid='" + itemid + "', ";
    queryString += "stockprice= '" + stockprice + "', ";
    queryString += "unit= '" + unit + "', ";
    queryString += "quantity=" + quantity + ", ";
    queryString += "serving_size= " + serving_size + " ";
    queryString += "WHERE itemid= '" + oldName + "';";
    console.log(queryString + "\n");
    pool
        .query(queryString)
        .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            console.log(query_res.rows[i]);
        }
    })

    res.status(200).json({itemid, stockprice, unit, quantity, serving_size});
});

app.post('/updateMenuItemInventoryArr', (req,res) => {
    const {menu_id, newIngredients} = req.body;
    var queryString = "UPDATE menu_items SET ingredient_list = " + toSQLArr(newIngredients) + " WHERE menu_id = " + menu_id;
    console.log(queryString);

    pool
        .query(queryString)
        .then(query_res => {
        for (let i = 0; i < query_res.rowCount; i++){
            console.log(query_res.rows[i]);
        }
    })

    res.status(200).json({menu_id, newIngredients});
});



// get max order id
app.get('/getMaxID', (req, res) => {
    var maxID;
    pool
        .query("SELECT MAX(order_id) FROM orders;")
        .then(query_res => {
            maxID = query_res.rows[0];
            console.log("MAX id is " + maxID); 
            data = { result : maxID };
            console.log("Query done");
            res.json(data);
        }
    );
});

app.post('/deleteInventoryItem', (req, res) => {
    console.log("inside update Menu item");
    const { inventoryID } = req.body;
    console.log(req.body);
  
    // Database Code here
    const queryString = "DELETE FROM inventory WHERE itemid= '" + inventoryID + "';";
    console.log(queryString);
    pool
        .query(queryString)
        .then(query_res => {
        // for (let i = 0; i < query_res.rowCount; i++){
        //     console.log(query_res.rows[i]);
        // }
    })

    res.status(200).json({ inventoryID });
});

app.post('/updateMenuIngredients', (req, res) => {
    console.log("inside update Menu item");
    const { menuID,menuIngredients,menuIngNum } = req.body;
    console.log(req.body);
  
    // Database Code here
    const queryString = "UPDATE menu_items SET ingredient_list= '" + menuIngredients +"', num_ingredients = '"+ menuIngNum + "' WHERE menu_id= '" + menuID +"';";
    console.log(queryString);
     pool
        .query(queryString)
        .then(query_res => {
        // for (let i = 0; i < query_res.rowCount; i++){
        //     console.log(query_res.rows[i]);
        // }
    })

    res.status(200).json({ menuID,menuIngredients,menuIngNum });
});


app.post('/updatePicture', (req, res) => {
    console.log("inside update picture");
    const {menu_id, item_name, image_url} = req.body;
    console.log(req.body);

    var url = image_url.replace("$","")

    const queryString = "UPDATE menu_items SET image_url= '" + url + "' WHERE menu_id= '" + menu_id + "';";
    console.log(queryString);
    pool
        .query(queryString)
        .then(query_res => {

    })

    res.status(200).json({menu_id, item_name, image_url});
})