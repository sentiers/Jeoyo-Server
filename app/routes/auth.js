var router = require('express').Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var UserData = require('../models/userData');
var User = require('../models/user');
var jwt = require('jsonwebtoken');

// ----------------------------------------------------------------

//==== 유저 등록 =========================
function registerUser(data) {
    return new Promise(function (resolve, reject) {
        var newUser = new User(data);
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.user_password, salt, (err, hash) => {
                if (err) {
                    reject(500);
                }
                newUser.user_password = hash;
                newUser.save((err) => {
                    if (err) {
                        if (err.code == 11000) {
                            reject(409);
                        } else {
                            reject(500);
                        }
                    } else {
                        var newUserData = new UserData();
                        newUserData.user_name = data.user_name;
                        newUserData.user_email = data.user_email;
                        newUserData.save((err) => {
                            if (err) {
                                reject(500);
                            } else {
                                resolve(201);
                            }
                        });
                    }
                });
            })
        })
    });
};

//==== 유저 설문조사 =========================
function termsOfUse(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_agreement.agreement_m': data.user_agreement.agreement_m,
                    'user_agreement.info_m': data.user_agreement.info_m,
                    'user_agreement.info_c': data.user_agreement.info_c,
                    'user_agreement.marketing_c': data.user_agreement.marketing_c
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 최초 로그인인가 =========================
function isFirstLogin(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            user_email: email
        }).then(user => {
            if (user.user_agreement.agreement_m == 0) {
                resolve(201);
            } else {
                resolve(200);
            }
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 현재유저의 현재 비밀번호확인 ==============
function checkUser(email, data) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            user_email: email
        }).then(user => {
            bcrypt.compare(data.user_password, user.user_password)
                .then((res) => {
                    if (res === false) {
                        reject(401);
                    } else {
                        resolve(200);
                    }
                }).catch((err) => {
                    reject(401);
                });
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 비밀번호변경 =========================
function updatePassword(email, data) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(data.user_new_pwd, salt, (err, hash) => {
                if (err) {
                    reject(500);
                } else {
                    User.updateOne(
                        { user_email: email },
                        {
                            $set: {
                                user_password: hash
                            }
                        }
                    ).then(() => {
                        resolve(200);
                    }).catch((err) => {
                        reject(401);
                    });
                }
            })
        })
    });
};

// 메일 인증함수*
function mail(email) {
    return new Promise(function (resolve, reject) {



    });
};


// ----------------------------------------------------------------

//==== GET 테스팅 ============================
router.get('/', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    res.send("/auth 페이지");
});

//==== GET 로그아웃 =============================
router.get('/logout', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    req.logout();
    res.status(200).send("200: 로그아웃 성공");
});

//==== POST 회원가입 ============================
router.post('/register', function (req, res, next) {
    registerUser(req.body)
        .then((code) => {
            res.status(code).send(code + ": 회원가입 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 회원가입 실패");
        });
});

//==== POST 이용약관 =============================
router.post('/termsofuse', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    termsOfUse(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 이용약관 동의 완료");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 이용약관 동의시 문제가 발생하였습니다");
        });
});

//==== POST 로그인(첫 로그인시 status 200 보내짐) =======
router.post('/login', function (req, res, next) {
    passport.authenticate('local', { session: false }, (err, user) => {
        if (err || !user) {
            res.status(401).send("401: 로그인 실패");
        } else {
            req.login(user, { session: false }, (err) => {
                var token = jwt.sign(user.toJSON(), '2021jeoyoapp2021');
                isFirstLogin(user.user_email)
                    .then((code) => {
                        res.status(code).json({ user, token });
                    }).catch((errcode) => {
                        res.status(errcode).send(errcode + ": 로그인 실패");
                    });
            });
        }
    })(req, res);
});

//==== POST 비밀번호 변경 =============================
router.post('/update', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    checkUser(req.user.user_email, req.body).then(() => {
        updatePassword(req.user.user_email, req.body)
            .then((code) => {
                res.status(code).send(code + ": 비밀번호 변경 성공");
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 비밀번호 변경 실패");
            });
    }).catch((errcode) => {
        res.status(errcode).send(errcode + ": 사용자인증 실패");
    });
});


// 이메일인증*
router.post('/email', function (req, res, next) {


});

// 비밀번호찾기*
router.post('/find', function (req, res, next) {



});

// google 계정으로 로그인*
router.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth',
        failureRedirect: '/401'
    }));


// ----------------------------------------------------------------

module.exports = router;