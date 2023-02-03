module.exports = function() {
    const mysql = require('mysql2');
    const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000',
    database: 'nodedb'
    });
    connection.connect();

    return connection;
}