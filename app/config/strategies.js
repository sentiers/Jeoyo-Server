var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var User = require('../models/user');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'user_email', passwordField: 'user_password' }, (user_email, user_password, done) => {
            User.findOne({
                user_email: user_email
            }).then(user => {
                if (!user) {
                    return done(null, false);
                }
                bcrypt.compare(user_password, user.user_password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    } else if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                });
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.user_email);
    });

    passport.deserializeUser(function (user_email, done) {
        User.find({user_email: user_email}).then((data =>{
            done(null, data);
        })) 
    });

}