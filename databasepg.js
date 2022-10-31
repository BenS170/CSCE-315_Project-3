const {Client} = require('pg')

const client = new Client({
    host: "csce-315-db.engr.tamu.edu",
    user: "csce315_910_spence",
    port: 5432,
    password: "Tippah2002!",
    database: "csce315_910_3",
    ssl: {rejectUnauthorized: false}
})

client.connect();

client.query('Select * from teammembers', (err, res) => {
    if(!err){
        console.log(res.rows);
    }else{
        console.log(err.message);
    }
    client.end;
})