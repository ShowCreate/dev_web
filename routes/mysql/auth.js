module.exports = function(passport) {
    const crypto = require('crypto');
    const connection = require('../../config/mysql/db')();
    const route = require('express').Router();

    // Login Page
    route.post('/login', passport.authenticate('local',
        {
            successRedirect : '/welcome',
            failureRedirect : '/auth/login',
            failureFlash    : false
        }
    ));

    route.get('/login', function(req, res) {
        res.render('auth/login');
    });

    // Logout Page
    route.get('/logout', function(req, res) {
        req.logout(function(err) {
            req.session.save(function() {
                res.redirect('/welcome');    
            });
        });
    });


    // Account Page
    route.post('/account', function(req, res) {
        var pwd = req.body.password;
        const salted = crypto.randomBytes(128).toString('base64');
        const hashPassword = crypto.pbkdf2Sync(pwd, salted, 3, 64, 'sha256').toString('hex');
        var user = {
            authId:'local:'+req.body.username,
            username: req.body.username,
            password: hashPassword,
            salt: salted,
            displayName: req.body.displayName,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address
        }
        var sql = 'INSERT INTO users SET ?';
        connection.query(sql, [user], function(err, results) {
            if (err) {
                console.log(err);
                res.status(500);    
            }
            else {
                req.login(user, function(err) {
                    req.session.save(function() {
                        res.redirect('/welcome');
                    });
                });
            }
        });
    });

    route.get('/account', function(req, res) {
        res.render('auth/account');
    });

    // DeleteUser Page
    route.get('/deleteUser', function(req, res) {
        var sql = 'DELETE FROM users WHERE authId=?'
        connection.query(sql, [req.user.authId], function(err, results) {
            req.logout(function(err) {
                req.session.save(function() {
                    res.redirect('/welcome');    
                });
            });
        });
    });

    return route;
}