const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 4000;

// Middleware to parse JSON and cookies
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// Route for serving the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for serving quote categories
app.get('/quotes', (req, res) => {
    fs.readFile('quoteData.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading quote data.');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Route for serving quotes by category
app.get('/quotes/:category', (req, res) => {
    const category = req.params.category;
    fs.readFile('quoteData.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading quote data.');
            return;
        }
        const quotes = JSON.parse(data);
        if (quotes[category]) {
            res.json(quotes[category]);
        } else {
            res.status(404).send('Category not found.');
        }
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    fs.readFile('userData.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading user data.');
            return;
        }
        const users = JSON.parse(data);
        if (users[username] && users[username].password === password) {
            res.cookie('username', username, { httpOnly: true });
            res.json({ status: 'success', message: 'Login successful' });
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }
    });
});

// Logout route
app.get('/logout', (req, res) => {
    res.clearCookie('username');
    res.redirect('/');
});

// Listen on the configured port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
