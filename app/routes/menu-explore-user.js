//====HANDLE POST ROUTES =============
var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
// ----------------------------------------------------------------

//==== 유저 id 별로 조회 =========================
function getUserById(idData) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            _id: idData
        }).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 모든 유저 가져오기 =========================
function getAllUsers() {
    return new Promise(function (resolve, reject) {
        UserData.find()
            .then(user => {
                resolve([200, user]);
            }).catch((err) => {
                reject(401);
            });
    });
};

// ----------------------------------------------------------------


//==== GET 유저 id 별로 하나 가져오기 =============================
router.get('/:id', function (req, res, next) {
    getUserById(req.params.id)
        .then((data) => {
            res.status(data[0]).send(data[1]);
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 유저 가져오기 실패");
        });
});

//==== GET 유저 필터링 =============================
router.get('/', function (req, res, next) {
    if (req.query.field) {
        console.log(req.query.field);
    }
    else {
        getAllUsers()
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 모든 유저 가져오기 실패");
            });
    }
});

module.exports = router;