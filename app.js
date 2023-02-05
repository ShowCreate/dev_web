const app = require('./config/mysql/express')();
const passport = require('./config/mysql/passport')(app);
const auth = require('./routes/mysql/auth')(passport);
const board = require('./routes/mysql/board')();

app.use('/auth', auth);
app.use('/board', board);

// Index Page
app.get('/', function(req, res) {
    res.render("index");
});

app.get('/welcome', function(req, res) {
    if(req.user) {
        res.send(`
        <h1>Hello, ${req.user.displayName}</h1>
        <ul>
            <li><a href="/board/list">게시판</a></li>
            <li><a href="/auth/logout">로그아웃</a></li>
            <li><a href="/auth/deleteUser">회원탈퇴</a></li>
        </ul>
        `);
    }
    else {
        res.send(`
        <h1>Welcome</h1>
        <ul>
            <li><a href="/board/list">게시판</a></li>
            <li><a href="/auth/login">로그인</a></li>
            <li><a href="/auth/account">회원가입</a></li>
        </ul>
        `);
    }
});

app.listen(3003, function() {
    console.log('Connected 3003 port!');
});