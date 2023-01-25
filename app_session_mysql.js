const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret              : 'What!@#123',
    resave              : false,
    saveUninitialized   : true,
    store               : new MySQLStore({
        host    : 'localhost',
        port    : 3306,
        user    : 'root',
        password: '0000',
        database: 'o2'
    })
}));

// User
var users = 
[
    {
        username    : 'JeongIn',
        password    : '494be1decdf5481a8e3e9776a712b94108462723aeb21fb85b80638be6b55effdf961282cfe9b3040a43e79ddf671467535722590732d45e861bf2c81cc8a377',
        salt        : '4SOdYsHBm/2ccrgAGUEeY++X385YEBHUPxnyVSnIjBt+fip2eiElfNsBuzWicMQRmCZQKRKhdYy61sHBvR1DQeDLa6lvX5NK4KftndSPV7CFl1CBAo/dGlbAPk0Fnm48la3NDQcuUqd6ySAmINnQYr0ws/cWUvkeawMfwNqqqXI=',
        displayName : 'JeongIn'
    }
];

// Crypto 
// const salt = crypto.randomBytes(128).toString('base64');
// const hashPassword = crypto.pbkdf2Sync(user.password, salt, 3, 64, 'sha256').toString('hex');
// console.log(salt);
// console.log(hashPassword);

// Index Page
app.get('/welcome', function(req, res) {
    if(req.session.displayName) {
        res.send(`
        <h1>Hello, ${req.session.displayName}</h1>
        <a href="/auth/logout">logout</a>
        `);
    }
    else {
        res.send(`
            <h1>Welcome</h1>
            <a href="/auth/login">Login</a>
            <a href="/auth/register">Register</a>
        `);
    }
});

// Register Page
app.post('/auth/register', function(req, res) {
    var pwd = req.body.password;
    const salted = crypto.randomBytes(128).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(pwd, salted, 3, 64, 'sha256').toString('hex');
    var user = {
        username: req.body.username,
        password: hashPassword,
        salt: salted,
        displayName: req.body.displayName
    }
    users.push(user);
    req.session.displayName = req.body.displayName;
    return req.session.save(function() {
        res.redirect('/welcome');
    });
});

app.get('/auth/register', function(req, res) {
    var output = `
    <h1>Register</h1>
    <form action="/auth/register" method="post">
        <p> <input type="text", name="username", placeholder="username"> </p>
        <p> <input type="password", name="password", placeholder="password"> </p>
        <p> <input tpye="text", name="displayName", placeholder="displayName" </p>
        <p> <input type="submit">
    </form>
    `;
    res.send(output);
});

// Login Page
app.post('/auth/login', function(req, res) {
    var uname = req.body.username;
    var pwd = req.body.password;
    var count = 0;
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if (uname === user.username && crypto.pbkdf2Sync(pwd, user.salt, 3, 64, 'sha256').toString('hex') === user.password) {
            req.session.displayName = user.displayName;
            req.session.save(function() {
                res.redirect('/welcome');
            });
        }
        else {
            count++;
            if (count === users.length) {
                res.redirect('/auth/login');
            }
        }
    }
});

app.get('/auth/login', function(req, res) {
    var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
        <p> <input type="text", name="username", placeholder="username"> </p>
        <p> <input type="password", name="password", placeholder="password"> </p>
        <p> <input type="submit">
    </form>
    `;
    res.send(output);
});

// Logout Page
app.get('/auth/logout', function(req, res) {
    delete req.session.displayName;
    req.session.save(function() {
        res.redirect('/welcome');    
    });
});

app.listen(3003, function() {
    console.log('Connected 3003 port!');
});