const express = require('express');
const app = express();
const cors = require('cors');
const { establish_connection, insert_data_to_database, check_data_to_database, update_data_from_database, delete_data_from_database } = require('./database_operations');

const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.static('public'));


app.get('/api', (req, res) => {
  const username = req.params.user_name;
  const password = req.params.pass_word;
  const message = "";
  if (check_data_to_database(username, password)) {
    message = "Login is successful";
  }
  else {
    message = "Login is unsuccessful as user is not found in the database."
  }
  res.status(200).send(message);
})

app.post('/api', (req, res) => {
  const u_name = req.params.user_name;
  const p_word = req.params.pass_word;

  if (check_data_to_database(u_name, p_word)) {
    update_data_from_database(u_name, p_word, req.params.new_p_word);
  }
  else {
    insert_data_to_database(u_name, p_word);
  }
})


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})