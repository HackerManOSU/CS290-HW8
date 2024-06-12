'use strict';

// Import required modules
const express = require('express');
const { engine } = require('express-handlebars');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 4000;

// Middleware to parse URL-encoded bodies and cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Set up Handlebars as the view engine
app.engine('hbs', engine({ 
  extname: '.hbs', 
  defaultLayout: false,
  partialsDir: path.join(__dirname, 'partials') // This sets the path relative to server.js


}));

app.set('view engine', 'hbs'); // Sets Handlebars as the template engine for rendering views

// Routes
app.get('/', (req, res) => {
  const username = req.cookies.username; // Retrieve username from cookies
  res.render('home', { username }); // Renders the home template passing username as data
});

app.get('/home', (req, res) => {
  const username = req.cookies.username;
  res.render('home', { username });
});

app.get('/login', (req, res) => {
  res.render('login'); // Renders the login form template
});

app.post('/login', (req, res) => {
  const userData = JSON.parse(fs.readFileSync('./userData.json', 'utf8')); // Reads user data from a JSON file and parses it
  const { username, password } = req.body; // Extracts username and password from the request body
  const validUser = userData[username]; // Checks if the username exists in the data

  if (!validUser) {
    res.render('login', { errorMessage: 'Invalid username' });
  } else if (validUser.password !== password) {
    res.render('login', { errorMessage: 'Invalid password' });
  } else {
    res.cookie('username', username); // Sets a cookie with the username
    res.redirect('/home'); // Redirects to home page
  }
});


app.get('/logout', (req, res) => {
  res.clearCookie('username'); // Clears the username cookie
  res.redirect('/'); // Redirects to the homepage
});

// Import and use quotes routes
const quotesRouter = require('./routes/quotes');
app.use('/quotes', quotesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
