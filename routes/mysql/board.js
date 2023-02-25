module.exports = function() {
    const connection = require('../../config/mysql/db')();
    const route = require('express').Router();

    // 글 목록 보기(List)
    route.get('/list', function(req, res) {
        res.redirect('/board/list/1');
    });

    route.get('/list/:page', function(req, res) {
        let page = req.params.page;

        let sql = "SELECT idx, title, name, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate, view FROM board";
        connection.query(sql, function (err, results) {
            if (err) {
                console.log(err);
            }
            res.render('board/list', {title: ' 게시판 리스트', rows: results, page: page, length: results.length-1, page_num: 10, pass: true});
        });
    });

    // 글 쓰기(Create)
    route.get('/write', function(req, res) {
        res.render('board/write',{title : "게시판 글 쓰기"});
    }); 

    route.post('/write', function(req,res) {
        let name = req.user.displayName;
        let title = req.body.title;
        let content = req.body.content;
        
        let sql = "INSERT INTO board(name, title, content, regdate, modidate, view) VALUES(?,?,?,now(),now(),0)";
        connection.query(sql, [name, title, content], function (err, results) {
            if (err) {
            console.log(err);
            }
            res.redirect('/board/list');
        });
    });

    // 글 읽기(Read)
    route.get('/read/:idx', function(req, res) {
        let idx = req.params.idx;
        
        let sql = "UPDATE board SET view = view + 1 WHERE idx=?";
        connection.query(sql,[idx], function(err, results) {});

        let sql1 = "SELECT idx, name, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, " +
        "date_format(regdate,'%Y-%m-%d %H:%i:%s') regdate, view FROM board WHERE idx=?";
        connection.query(sql1, [idx], function(err, results) {
            if(err) {
                console.log(err);
            }
            res.render('board/read', {title: "글 보기", row: results[0]});
        });
    });

    
    // 글 수정(Update)
    route.get('/edit/:idx', function(req, res) {
        let sql = 'SELECT idx, title FROM board';
        connection.query(sql, function(err, topics, fields) {
            let idx = req.params.idx;
            let sql = 'SELECT * FROM board WHERE idx=?';
            connection.query(sql, [idx], function(err, topic, fields) {
                if (err) { 
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else {
                    res.render('board/edit', {topics: topics, topic: topic[0]});
                }
            });
        });
    });

    route.post('/edit/:idx',function(req,res) {
        let idx = req.params.idx;
        let title = req.body.title;
        let content = req.body.content;

        let sql = "UPDATE board SET title=?, content=?, modidate=now() WHERE idx=?";
        connection.query(sql,[title, content,idx], function(err, result)
        {
            if(err) {
                console.log(err);
            }
            res.redirect('/board/read/'+idx);
        });
    });
    
    // 글 삭제(Delete)
    route.get('/delete/:idx', function(req, res) {
        let sql = 'SELECT idx, title FROM board';
        connection.query(sql, function(err, topics, fields) {
            let idx = req.params.idx;
            let sql = 'SELECT * FROM board WHERE idx=?';
            connection.query(sql, [idx], function(err, topic) {
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
                        res.render('board/delete', {topics: topics, topic: topic[0]});
                    }
                }
            });
        });
    });

    route.post('/delete/:idx', function(req, res) {
        let idx = req.params.idx;
        let sql = 'DELETE FROM board WHERE idx=?';
        connection.query(sql, [idx], function(err, results) {
            res.redirect('/board/list');
        });
    });

    return route;
}