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
function surveyUser(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_agreement.agreement_m': data.user_agreement.agreement_m,
                    'user_agreement.info_m': data.user_agreement.info_m,
                    'user_agreement.info_c': data.user_agreement.info_c,
                    'user_agreement.marketing_c': data.user_agreement.marketing_c,
                    'user_location': data.user_location,
                    'user_field': data.user_field,
                    'user_selection.q1': data.user_selection.q1,
                    'user_selection.q2': data.user_selection.q2,
                    'user_selection.q3': data.user_selection.q3,
                    'user_selection.q4': data.user_selection.q4,
                    'user_selection.q5': data.user_selection.q5,
                }
            }
        ).then(() => {
            resolve("설문조사 완료");
        }).catch((err) => {
            reject(err);
        });
    });
};

//==== 최초 로그인인가 =========================
function isFirstLogin(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            user_email: email
        }).then(user => {
            var msg = "환영합니다 " + user.user_name + "님";
            if (user.user_agreement.agreement_m == 0) {
                msg = "firstLogin";
            }
            resolve(msg);
        }).catch((err) => {
            reject(err);
        });
    });
};












// 라우팅 ---------------------------------------------------------------


//==== 테스팅  ====
router.get('/', function (req, res, next) {

});

//====회원가입 ============================
router.post('/register', function (req, res, next) {
    registerUser(req.body)
        .then((msg) => {
            res.send(msg);
        }).catch((err) => {
            res.send(err);
        });
});

//====설문조사 =============================
router.post('/survey', function (req, res, next) {
    surveyUser(req.session.passport.user, req.body)
        .then((msg) => {
            res.send(msg);
        }).catch((err) => {
            res.send(err);
        });
});

//====비밀번호찾기 =========================
router.post('/find', function (req, res, next) {
    res.send("finding");
});

//====로그인(첫 로그인시 firstLogin 메시지보내짐) =============================
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/401' }),
    function (req, res, next) {
        isFirstLogin(req.session.passport.user)
            .then((msg) => {
                res.send(msg);
            }).catch((err) => {
                res.send(err);
            });
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