const {Client} = require("pg");
//const express = require("express");
//const app = express();

const client = new Client({
  "user": "csce315_910_spence",
  "host": "csce-315-db.engr.tamu.edu",
  "database": "csce315_910_3",
  "password": "Tippah2002!",
  "port": 5432,
  ssl: {rejectUnauthorized: false}
});

start();

async function start() {
    await connect();
    const todos = await readTodos();
    console.log(todos);

    // const successCreate = await createTodo("Go to trader joes")
    // console.log('Creating was ${successCreate}')

    // const successDelete = await deleteTodo(1)
    // console.log('Deleting was ${successDelete}')
}

async function connect() {
    try {
        await client.connect();
    }catch (e){
        console.error(`Failed to connect ${e}`);
    }
}

async function readTodos(){
    try {
        const results = await client.query("select * from teammembers");
        return results.rows;
    }catch (e){
        return [];
    }
}


  
  