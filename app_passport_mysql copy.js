const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'o2'
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret              : 'What!@#123',
    resave              : false,
    saveUninitialized   : false,
    store               : new MySQLStore({
        host    : 'localhost',
        port    : 3306,
        user    : 'root',
        password: '0000',
        database: 'o2'
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
    res.redirect('/welcome');
});

// Logout Page
app.get('/auth/logout', function(req, res) {
    req.logout(function(err) {
        req.session.save(function() {
            res.redirect('/welcome');    
        });
    });
});

// Index Page
app.get('/welcome', function(req, res) {
    if(req.user) {
        res.send(`
        <h1>Hello, ${req.user.displayName}</h1>
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
        authId:'local:'+req.body.username,
        username: req.body.username,
        password: hashPassword,
        salt: salted,
        displayName: req.body.displayName
    }
    var sql = 'INSERT INTO users SET ?';
    connection.query(sql, [user], function(err, results) {
        if (err) {
            console.log(err);
            res.status(500);    
        }
        else {
            req.login(user, function(err) {
                req.session.save(function() {
                    res.redirect('/welcome');
                });
            });
        }
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

// Passport(Authentication)
passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    var sql = 'SELECT * FROM users WHERE authId=?';
    connection.query(sql, [id], function(err, results) {
        if (err) {
            console.log(err);
            done('There is no user.');
        }
        else {
            done(null, results[0]);
        }
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        var uname = username;
        var pwd = password;
        var sql = 'SELECT * FROM users WHERE authId=?';
        connection.query(sql, ['local:'+uname], function(err, results) {
            if (err) {
                return done('There is no user.');
            }
            var user = results[0];
            if (crypto.pbkdf2Sync(pwd, user.salt, 3, 64, 'sha256').toString('hex') === user.password) {
                console.log('LocalStrategy', user);
                done(null, user);
            }
            else {
                done(null, false);
            }
        });
    }
));

// Login Page
app.post('/auth/login', passport.authenticate('local',
    {
        successRedirect : '/welcome',
        failureRedirect : '/auth/login',
        failureFlash    : false
    }
));

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

app.listen(3003, function() {
    console.log('Connected 3003 port!');
});