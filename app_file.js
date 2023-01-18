const express = require('express');
const app = express();

app.locals.pretty = true;

app.set('views', './views_file');
app.set('view engine', 'pug');

app.get('/topic/new', function(req, res) {
    res.render('new');
})

app.listen(3000, function() {
    console.log('Connected, 3000 port!');
})