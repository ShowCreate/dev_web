module.exports = function() {
    const express = require('express');
    const session = require('express-session');
    const MySQLStore = require('express-mysql-session')(session);
    const bodyParser = require('body-parser');
    
    const app = express();
    
    app.set('views', './views/mysql');
    app.set('view engine', 'pug');
    
    app.use(express.static('public'))
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({
        secret              : 'What!@#123',
        resave              : false,
        saveUninitialized   : false,
        store               : new MySQLStore({
            host    : 'localhost',
            port    : 3306,
            user    : 'root',
            password: '0000',
            database: 'nodedb'
        })
    }));


    return app;
}