const app = require('./config/mysql/express')();
const passport = require('./config/mysql/passport')(app);
const auth = require('./routes/mysql/auth')(passport);
const board = require('./routes/mysql/board')();

app.use('/auth', auth);
app.use('/board', board);

// Index Page
app.get('/', function(req, res) {
    if(req.user) {
        res.render('index2', {name: req.user.displayName})
    }
    else {
        res.render('index');
    }
});

app.listen(3000, function() {
    console.log('서버가 실행됩니다. http://127.0.0.1:3000');
});