module.exports = function() {
    const connection = require('../../config/mysql/db')();
    const route = require('express').Router();

    // 글 추가 (Create)
    route.get('/add', function(req, res) {
        var sql = 'SELECT id, title FROM topic';
        connection.query(sql, function(err, topics, fields) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            res.render('topic/add', {topics: topics});    
        });
    });

    route.post('/add', function(req, res) {
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
    route.get(['/:id/edit'], function(req, res) {
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
                        res.render('topic/edit', {topics: topics, topic: topic[0]});
                    }
                });
            }
            else {
                console.log('There is no id.');
                res.status(500).send('Internal Server Error');
            }
        });
    });

    route.post(['/:id/edit'], function(req, res) {
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
    route.get('/:id/delete', function(req, res) {
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
                        res.render('topic/delete', {topics: topics, topic: topic[0]});
                    }
                }
            });
        });
    });

    route.post('/:id/delete', function(req, res) {
        var id = req.params.id;
        var sql = 'DELETE FROM topic WHERE id=?';
        connection.query(sql, [id], function(err, results) {
            res.redirect('/topic/');
        });
    });

    // 글 보기 (Read)
    route.get(['/', '/:id'], function(req, res) {
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
                        res.render('topic/view', {topics: topics, topic: topic[0]});
                    }
                });
            }
            else {
                res.render('topic/view', {topics: topics});
            }
        });
    });

    return route;
}