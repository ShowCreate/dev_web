const app = require('./config/mysql/express')();

const passport = require('./config/mysql/passport')(app);

// Index Page
app.get('/', function(req, res) {
    res.redirect('/welcome');
});

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

const auth = require('./routes/mysql/auth')(passport);
app.use('/auth', auth);

app.listen(3003, function() {
    console.log('Connected 3003 port!');
});