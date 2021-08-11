var passport = require('passport');
var passportJWT = require("passport-jwt");

var LocalStrategy = require('passport-local').Strategy;
var JWTStrategy = passportJWT.Strategy;
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var ExtractJWT = passportJWT.ExtractJwt;
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

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: '2021jeoyoapp2021'
    }, function (jwtPayload, done) {
        return User.findOne({ _id: jwtPayload._id })
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.user_email);
    });

    passport.deserializeUser(function (user_email, done) {
        User.find({ user_email: user_email }).then((data => {
            done(null, data);
        }))
    });
}