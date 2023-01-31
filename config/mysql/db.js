module.exports = function() {
    const mysql = require('mysql2');
    const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'o2'
    });
    connection.connect();

    return connection;
}