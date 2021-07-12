var LocalStrategy = require('passport-local').Strategy;
var UserAccount = require('../models/userAccount');


module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'user_email' }, (user_email, user_password, done) => {
            UserAccount.findOne({
                user_email: user_email
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: '에러: 유저를 찾을 수 없습니다' });
                }
                bcrypt.compare(user_password, user.user_password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    } else if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: '에러: 비밀번호 불일치' });
                    }
                });
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserAccount.findById(id, function (err, user) {
            done(err, user);
        });
    });

}