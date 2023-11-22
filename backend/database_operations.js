const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

// Replace "your-mongodb-uri" with your actual MongoDB Atlas connection string
const uri = "mongodb://saikrishnadattub:mongodb@ac-fd5uwou-shard-00-00.alirgiw.mongodb.net:27017,ac-fd5uwou-shard-00-01.alirgiw.mongodb.net:27017,ac-fd5uwou-shard-00-02.alirgiw.mongodb.net:27017/?ssl=true&replicaSet=atlas-hmvu1i-shard-0&authSource=admin&retryWrites=true&w=majority";

async function establish_connection() {
  try {
    const connection = MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    return connection;
  }
  catch (err) {
    console.log("connection establishment got failed--", err);
  }
}

async function insert_data_to_database(user_name, pass_word) {

  const database_conn = await establish_connection();
  const obj = {
    username: user_name,
    password: pass_word
  }
  await database_conn.db.data.insertOne(obj);
  database_conn.close();
  console.log(`${obj} ---- is inserted into the database.`)
}

function check_data_to_database(user_name,pass_word){
  const database_conn = establish_connection();
  const resp = database_conn.db.data.findOne({username:`${username}`,password:`${password}`});
  return resp;
}

async function update_data_from_database(user_name, old_password, new_password) {

  const database_conn = await establish_connection();
  try {
    console.log("user found");
    await database_conn.db.data.updateMany({ username: user_name, password: old_password }, { $set: { password: new_password } });
    database_conn.close();
    console.log("data is updated");
  }
  catch (err) {
    console.log("user not found");
  }
}

async function delete_data_from_database(user_name, pass_word) {

  const database_conn = await establish_connection();
  try {
    await database_conn.db.data.deleteOne({ username: user_name, password: pass_word });
    database_conn.close();
    console.log("data is deleted");
  }
  catch (err) {
    console.log("deletion not happened.error occured");
  }
}


module.exports = {
  establish_connection,
  insert_data_to_database,
  update_data_from_database,
  delete_data_from_database
}