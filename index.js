const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Database connection
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'login_registration';

let db;

MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    console.log('Connected to MongoDB successfully!');
    db = client.db(dbName);
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/register.html');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const user = {
    username: username,
    password: password,
  };

  db.collection('users').insertOne(user, (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      res.redirect('/register');
    } else {
      console.log('User registered successfully:', result.ops[0]);
      res.redirect('/');
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.collection('users').findOne({ username: username, password: password }, (err, user) => {
    if (err || !user) {
      console.error('Invalid credentials:', err);
      res.redirect('/');
    } else {
      console.log('Login successful.');
      res.send('Login successful.');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
