const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Use session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Database connection
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'DaveRider08',
  password: 'Rampage08',
  database: 'movies'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Fetch and display movies
app.get('/movies', (req, res) => {
  connection.query('SELECT * FROM movies', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.stack);
      res.status(500).send('Error fetching data');
      return;
    }

    res.render('movies', { movies: results });
  });
});

// Search for movies
app.get('/search', (req, res) => {
  const title = req.query.title;
  if (!req.session.searches) {
    req.session.searches = [];
  }
  req.session.searches.push(title);

  connection.query('SELECT * FROM movies WHERE title LIKE ?', [`%${title}%`], (err, results) => {
    if (err) {
      console.error('Error searching for movies:', err.stack);
      res.status(500).send('Error searching for movies');
      return;
    }

    res.render('search', { movies: results, previousSearches: req.session.searches });
  });
});

// Display search form
app.get('/search-form', (req, res) => {
  res.render('search', { movies: null, previousSearches: req.session.searches || [] });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});