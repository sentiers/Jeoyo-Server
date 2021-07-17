//====HANDLE MY PAGE ROUTES =============
var router = require('express').Router();
var User = require('../models/user');
var UserData = require('../models/userData');


//==== 내 정보가져오기 =========================
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



//==== 내 정보 업데이트 =========================
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
            resolve("설문조사 완료");
        }).catch((err) => {
            reject(err);
        });
    });
};




//====마이페이지 메인 =============================
router.get('/', function (req, res, next) {
    getMyInfo(req.session.passport.user)
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err);
        });
});


//====내 정보 보기=============================
router.get('/info', function (req, res, next) {
    getMyInfo(req.session.passport.user)
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err);
        });
});

//====GET 업데이트 =============================
router.get('/update', function (req, res, next) {
    getMyInfo(req.session.passport.user)
        .then((data) => {
            res.send(data);
        }).catch((err) => {
            res.send(err);
        });
});

//====POST 업데이트 =============================
router.post('/update', function (req, res, next) {
    updateMyInfo(req.session.passport.user, req.body)
        .then((msg) => {
            res.send(msg);
        }).catch((err) => {
            res.send(err);
        });
});




module.exports = router;