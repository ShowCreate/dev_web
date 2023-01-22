const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'o2'
});
connection.connect();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.locals.pretty = true;

app.set('views', './views_mysql');
app.set('view engine', 'pug');

// 글 추가 (Create)
app.get('/topic/add', function(req, res) {
    var sql = 'SELECT id, title FROM topic';
    connection.query(sql, function(err, topics, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('add', {topics: topics});    
    });
});

app.post('/topic/add', function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
    connection.query(sql, [title, description, author], function(err, results, fiedls) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        else {
            res.redirect('/topic/'+results.insertId);
        }
    });
});

// 글 수정 (Update)
app.get(['/topic/:id/edit'], function(req, res) {
    var sql = 'SELECT id, title FROM topic';
    connection.query(sql, function(err, topics, fields) {
        var id = req.params.id;
        if (id) {
            var sql = 'SELECT * FROM topic WHERE id=?';
            connection.query(sql, [id], function(err, topic, fields) {
                if (err) { 
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else {
                    res.render('edit', {topics: topics, topic: topic[0]});
                }
            });
        }
        else {
            console.log('There is no id.');
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post(['/topic/:id/edit'], function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;
    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    connection.query(sql, [title, description, author, id], function(err, results, fields) {
        if (err) { 
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        else {
            res.redirect('/topic/'+id);
        }
    });
});

// 글 삭제 (Delete)
app.get('/topic/:id/delete', function(req, res) {
    var sql = 'SELECT id, title FROM topic';
    var id = req.params.id;
    connection.query(sql, function(err, topics, fields) {
        var sql = 'SELECT * FROM topic WHERE id=?';
        connection.query(sql, [id], function(err, topic) {
            if (err) { 
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            else {
                if (topic.length === 0) {
                    console.log('There is no record');
                    res.status(500).send('Internal Server Error');
                }
                else {   
                    res.render('delete', {topics: topics, topic: topic[0]});
                }
            }
        });
    });
});

app.post('/topic/:id/delete', function(req, res) {
    var id = req.params.id;
    var sql = 'DELETE FROM topic WHERE id=?';
    connection.query(sql, [id], function(err, results) {
        res.redirect('/topic/');
    });
});

// 글 보기 (Read)
app.get(['/topic', '/topic/:id'], function(req, res) {
    var sql = 'SELECT id, title FROM topic'; 
    connection.query(sql, function(err, topics) {
        var id = req.params.id;
        if (id) {
            var sql = 'SELECT * FROM topic WHERE id=?';
            connection.query(sql, [id], function(err, topic) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else {
                    res.render('view', {topics: topics, topic: topic[0]});
                }
            });
        }
        else {
            res.render('view', {topics: topics});
        }
    });
});

// 3000 포트
app.listen(3000, function() {
    console.log('Connected, 3000 port!');
}); 