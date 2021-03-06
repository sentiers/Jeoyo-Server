// ----------------------------------------------------------------
var router = require('express').Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var UserData = require('../models/userData');
var User = require('../models/user');
// ----------------------------------------------------------------

// 현재 날짜, 시간 반환하는 함수
function getCurrentDateTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
};

// ----------------------------------------------------------------

//==== 유저 등록 함수 =========================
function registerUser(data) {
    return new Promise(function (resolve, reject) {
        var newUser = new User(data);
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.user_password, salt, (err, hash) => { // 비밀번호 해싱
                if (err) {
                    reject(500);
                }
                newUser.user_password = hash;
                newUser.save((err) => { // 유저 저장
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
                        newUserData.user_created_at = getCurrentDateTime(); // 유저데이터생성시점
                        newUserData.user_updated_at = getCurrentDateTime();
                        newUserData.save((err) => { // 유저 데이터 저장
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

//==== 회원탈퇴 함수=========================
function deleteAccount(email) {
    return new Promise(function (resolve, reject) {
        UserData.deleteOne({ // 유저데이터 삭제
            user_email: email
        }).then(() => {
            User.deleteOne({ // 유저 삭제
                user_email: email
            }).then(() => {
                resolve(200);
            }).catch((err) => {
                reject(500);
            });
        }).catch((err) => {
            reject(500);
        });
    });
};

//==== 유저 설문조사 함수=========================
function termsOfUse(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne( // 유저데이터 업데이트
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

//==== 최초 로그인판별 함수 =========================
function isFirstLogin(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            user_email: email
        }).then(user => {
            if (user.user_agreement.agreement_m == 0) { // 이용약관동의 여부
                resolve(201);
            } else {
                resolve(200);
            }
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 현재유저의 현재 비밀번호확인 함수 ==============
function checkUser(email, data) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            user_email: email
        }).then(user => {
            bcrypt.compare(data.user_password, user.user_password) // 비밀번호 일치 확인
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

//==== 비밀번호변경 함수 =========================
function updatePassword(email, data) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(data.user_new_pwd, salt, (err, hash) => { // 비밀번호 해싱
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

//==== GET 회원탈퇴 =============================
router.get('/resignation', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    deleteAccount(req.user.user_email)
        .then((code) => {
            res.status(code).send(code + ": 회원탈퇴 완료");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 회원탈퇴 실패");
        });
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

// ** 이메일인증 기능
router.post('/email', function (req, res, next) {

});

// ** 비밀번호찾기 기능
router.post('/find', function (req, res, next) {

});

// ----------------------------------------------------------------

module.exports = router;