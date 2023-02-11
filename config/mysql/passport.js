module.exports = function(app) {
    const connection = require('./db')();
    const crypto = require('crypto');
    const passport = require('passport');
    const LocalStrategy = require('passport-local');
    
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
    });

    passport.deserializeUser(function(id, done) {
        console.log('deserializeUser', id);
        let sql = 'SELECT * FROM users WHERE authId=?';
        connection.query(sql, [id], function(err, results) {
            if (err) {
                console.log(err);
                done('There is no user.');
            }
            else {
                done(null, results[0]);
            }
        });
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            let uname = username;
            let pwd = password;
            let sql = 'SELECT * FROM users WHERE authId=?';
            connection.query(sql, ['local:'+uname], function(err, results) {
                if (err) {
                    return done('There is no user.');
                }
                let user = results[0];
                if (crypto.pbkdf2Sync(pwd, user.salt, 3, 64, 'sha256').toString('hex') === user.password) {
                    console.log('LocalStrategy', user);
                    done(null, user);
                }
                else {
                    done(null, false);
                }
            });
        }
    ));
    
    return passport;
}