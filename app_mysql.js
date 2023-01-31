const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.locals.pretty = true;

app.set('views', './views/mysql');
app.set('view engine', 'pug');

const topic = require('./routes/mysql/topic')();
app.use('/topic', topic);

// 3000 포트
app.listen(3000, function() {
    console.log('Connected, 3000 port!');
}); 