//====HANDLE MY PAGE ROUTES =============
var router = require('express').Router();
var UserData = require('../models/userData');

// ----------------------------------------------------------------

//==== 유저 정보가져오기 =========================
function getMyInfo(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            user_email: email
        }).then(user => {
            console.log(user);
            resolve(user);
        }).catch((err) => {
            reject(err);
        });
    });
};

//==== 개인정보 수정 (한꺼번에) =========================
function updateMyInfo(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_name': data.user_name,
                    'user_gender': data.user_gender,
                    'user_education': data.user_education,
                    'user_major': data.user_major,
                    'user_location': data.user_location,
                    'user_field': data.user_field
                }
            }
        ).then(() => {
            resolve("개인정보 수정 완료");
        }).catch((err) => {
            reject(err);
        });
    });
};

//==== 지역 수정 =========================
function updateLocation(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_location': data.user_location
                }
            }
        ).then(() => {
            resolve("지역 수정 완료");
        }).catch((err) => {
            reject(err);
        });
    });
};

//==== 관심분야 수정 =========================
function updateField(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_field': data.user_field
                }
            }
        ).then(() => {
            resolve("관심분야 수정 완료");
        }).catch((err) => {
            reject(err);
        });
    });
};

//==== 설문지 수정 =========================
function updateSurvey(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_selection.q1': data.user_selection.q1,
                    'user_selection.q2': data.user_selection.q2,
                    'user_selection.q3': data.user_selection.q3,
                    'user_selection.q4': data.user_selection.q4,
                    'user_selection.q5': data.user_selection.q5,
                }
            }
        ).then(() => {
            resolve("설문지 수정 완료");
        }).catch((err) => {
            reject(err);
        });
    });
};

// 테스팅용 데이터보내는 함수 user_name = "keke"
function testing() {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            user_name: "keke"
        }).then(user => {
            console.log(user);
            resolve(user);
        }).catch((err) => {
            reject(err);
        });
    });
};

// ----------------------------------------------------------------

//==== GET 유저정보가져오기 =============================
router.get('/', function (req, res, next) {
    //    getMyInfo(req.session.passport.user)
    //        .then((data) => {
    //            res.status(200).send(data);
    //        }).catch((err) => {
    //            res.status(401).send(err);
    //        });

    testing()
        .then((data) => {
            res.status(200).send(data);
        }).catch((err) => {
            res.status(401).send(err);
        });
});

//==== POST 유저 정보수정(한꺼번에) =============================
router.post('/update', function (req, res, next) {
    updateMyInfo(req.session.passport.user, req.body)
        .then((msg) => {
            res.send(msg);
        }).catch((err) => {
            res.send(err);
        });
});

//==== POST 지역 수정 =============================
router.post('/location', function (req, res, next) {
    updateLocation(req.session.passport.user, req.body)
        .then((msg) => {
            res.send(msg);
        }).catch((err) => {
            res.send(err);
        });
});

//==== POST 관심분야 수정 =============================
router.post('/field', function (req, res, next) {
    updateField(req.session.passport.user, req.body)
        .then((msg) => {
            res.send(msg);
        }).catch((err) => {
            res.send(err);
        });
});

//==== POST 설문지 =============================
router.post('/survey', function (req, res, next) {
    updateSurvey(req.session.passport.user, req.body)
        .then((msg) => {
            res.send(msg);
        }).catch((err) => {
            res.send(err);
        });
});

module.exports = router;