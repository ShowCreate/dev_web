// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'o2'
});

connection.connect();
/**
var sql = 'SELECT * FROM `topic`';
connection.query(sql, function(err, results, fields) {
    for (var i = 0; i < results.length; i++) {
        console.log(results[i].author);
    }
});

var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'graphic'];
connection.query(sql, params, function(err, results, fields) {
    console.log(results.insertId);
});

var sql = 'UPDATE topic SET title=?, description=? WHERE id=?';
var params = [NPM, leezche, 1];
connection.query(sql, params, function(err, results, fields) {
    console.log(results);
});
*/

var sql = 'DELETE FROM topic WHERE id=?';
var params = [1];
connection.query(sql, params, function(err, results, fields) {
    console.log(results);
});

connection.end();