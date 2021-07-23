var passport = require('passport');
var passportJWT = require("passport-jwt");

var ExtractJWT = passportJWT.ExtractJwt;

var LocalStrategy = require('passport-local').Strategy;
var JWTStrategy = passportJWT.Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
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

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: '2021jeoyoapp2021'
    }, function (jwtPayload, done) {
        return User.findOne(jwtPayload.id)
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

    // 저요 안드로이드   
    // AIzaSyAR1n1SaxoAOvzjH3677Nct9bZwqXjhVDk
    // 746612525317-ffjie0da94c8u1vur141kfc2i8c6mjsl.apps.googleusercontent.com

    //저요 웹
    // 746612525317-k4c6poc0a223v1q4bh81jgbb29lg15s9.apps.googleusercontent.com
    // KAcUV8P9Wr_592tMYOKdjgJj

    passport.use(new GoogleStrategy({
        clientID: '746612525317-k4c6poc0a223v1q4bh81jgbb29lg15s9.apps.googleusercontent.com',
        clientSecret: 'KAcUV8P9Wr_592tMYOKdjgJj',
        callbackURL: "http://localhost:8080/auth/google/callback",
    },
        function (accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ googleId: profile.id }, function (err, user) {
                return cb(err, user);
            });
        }
    ));
}