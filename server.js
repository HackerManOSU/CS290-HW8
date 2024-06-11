'use strict';

const express = require('express');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;

// Middleware to parse URL-encoded bodies and cookies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Set up Handlebars as the view engine
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: false}));
app.set('view engine', 'hbs');

// Routes
app.get('/', (req, res) => {
  const username = req.cookies.username;
  res.render('home', { username });
});

app.get('/home', (req, res) => {
  const username = req.cookies.username;
  res.render('home', { username });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const userData = JSON.parse(fs.readFileSync('./userData.json', 'utf8'));
  const { username, password } = req.body;
  const validUser = userData[username];

  if (!validUser) {
    res.render('login', { errorMessage: 'Invalid username' });
  } else if (validUser.password !== password) {
    res.render('login', { errorMessage: 'Invalid password' });
  } else {
    res.cookie('username', username);
    res.redirect('/home');
  }
});


app.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});

// Import and use quotes routes
const quotesRouter = require('./routes/quotes');
app.use('/quotes', quotesRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
