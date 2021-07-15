//====HANDLE AUTHORIZATION ROUTES ============================
var router = require('express').Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var UserData = require('../models/userData');
var User = require('../models/user');

//====UTILITY FUNCTIONS========================================

//==== 메일 인증 =========================
// 일단 나중에


//==== 유저 등록 =========================
function registerUser(data) {
    return new Promise(function (resolve, reject) {
        var newUser = new User(data);
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.user_password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                newUser.user_password = hash;
                newUser.save((err) => {
                    if (err) {
                        if (err.code == 11000) {
                            reject("에러: 해당 이메일은 사용중입니다");
                        } else {
                            reject("에러: " + err);
                        }
                    } else {
                        var newUserData = new UserData();
                        newUserData.user_name = data.user_name;
                        newUserData.user_email = data.user_email;
                        newUserData.save((err) => {
                            if (err) {
                                reject("에러: " + err);
                            } else {
                                resolve("성공: 유저 등록");
                            }
                        });
                    }
                });
            })
        })
    });
};

//==== 유저 설문조사 =========================
function surveyUser() {



}



//====테스팅 용도 =========================
router.get('/', function (req, res, next) {
    res.send("hello auth");
});

//====회원가입 ============================
router.post('/register', function (req, res, next) {
    console.log(req.body);
    registerUser(req.body)
        .then((msg) => {
            res.send(msg);
        }).catch((err) => {
            res.send(err);
        });
});

//====설문조사 =============================
router.get('/survey', function (req, res, next) {
    console.log(req.session);
    res.send("surveying");
});

//====비밀번호찾기 =========================
router.post('/find', function (req, res, next) {
    res.send("finding");
});

//====로그인 =============================
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/401',
    })(req, res, next);
});

//====비밀번호 변경 =============================
router.post('/update', function (req, res, next) {
    res.send("updating");
});

//====로그아웃 =============================
router.get('/logout', function (req, res, next) {
    req.logout();
    res.send("성공: 로그아웃");
});

//====google 계정으로 로그인 =================
router.get('/google', function (req, res, next) {

});

module.exports = router;