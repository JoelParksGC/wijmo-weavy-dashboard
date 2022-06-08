const express = require('express');
const path = require('path');
const fs = require('fs');
const njwt = require('njwt');
const bodyParser = require('body-parser');

const app = express();

const token = { name: '', value: '' };

const users = [
    { email: "chloe@demo.com", name: "Chloe Hunt", username: "chloe", picture: "https://i.pravatar.cc/150/?img=49" },
    { email: "patrick@demo.com", name: "Patrick Russell", username: "patrick", picture: "https://i.pravatar.cc/150/?img=52" },
    { email: "alisa@demo.com", name: "Alisa Malone", username: "alisa", picture: "https://i.pravatar.cc/150/?img=47" },
    { email: "kendal@demo.com", name: "Kendal Herbert", username: "kendal", picture: "https://i.pravatar.cc/150/?img=51" },
];

// Generates user's JWT
const generateToken = (name) => {
    // Checks if user has been set
    if(!name) {
        alert("User not set!");
        return null;
    }
    // Get user from list
    const user = users.find((u) => u.name === name);
    // Replace this with your own Weavy Identity Provider Secret
    var signingKey = "TtLzgH#]pgq3V87H";
    var claims = {
        iss: "wijmo-weavy-hackathon",
        sub: user.username,
        dir: "hackathon",
        name: user.name,
        picture: user.picture,
        username: user.username
    }
    // Generates token based on user info
    var jwt = njwt.create(claims, signingKey);
    jwt.setExpiration(new Date().getTime() + (60 * 60 * 1000));
    token.name = name;
    token.value = jwt.compact();
}

// Body parser for response
app.use(bodyParser.urlencoded({
    extended: false
}));

// Serves static files (JavaScript, CSS)
app.use('/static', express.static(path.resolve(__dirname, '../dist')));

// Routes to login page
app.get('/', function(req, res) {
    const pathToHtmlFile = path.resolve(__dirname, '../dist/login.html');
    const contentFromHtmlFile = fs.readFileSync(pathToHtmlFile, 'utf-8');
    res.send(contentFromHtmlFile);
});

// Routes to webstats page
app.get('/websessions', function(req, res) {
    const pathToHtmlFile = path.resolve(__dirname, '../dist/websessions.html');
    const contentFromHtmlFile = fs.readFileSync(pathToHtmlFile, 'utf-8');
    res.send(contentFromHtmlFile);
});

// POST request from form submission, re-routes to websessions page
app.post('/auth-login', (req, res) => {
    generateToken(req.body.name);
    res.redirect('/websessions');
})

// POST request for logout
app.post('/logout', (req, res) => {
    token.name = '';
    token.value = '';
    res.redirect('/');
})

// GET request for JWT
app.get('/token', (req, res) => {
    generateToken(token.name);
    res.send(token);
})

app.listen(3000, function() {
    console.log('Application is running on http://localhost:3000/');
});