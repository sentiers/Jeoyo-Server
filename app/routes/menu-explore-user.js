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

//==== 유저 지역 & 직무 필터=========================
function getLocationFieldUsers(location, field) {
    return new Promise(function (resolve, reject) {
        UserData.find(
            {
                user_location: { $elemMatch: { $eq: location } },
                user_field: { $elemMatch: { $eq: field } }
            }
        ).then(user => {
            resolve([200, user]);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 유저 지역 필터=========================
function getLocationUsers(location) {
    return new Promise(function (resolve, reject) {
        UserData.find(
            {
                user_location: { $elemMatch: { $eq: location } }
            }
        ).then(user => {
            resolve([200, user]);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 유저 직무 필터 =========================
function getFieldUsers(field) {
    return new Promise(function (resolve, reject) {
        UserData.find(
            {
                user_field: { $elemMatch: { $eq: field } }
            }
        ).then(user => {
            resolve([200, user]);
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
    if (req.query.location && req.query.field) {
        getLocationFieldUsers(req.query.location, req.query.field)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 유저 가져오기 실패");
            });
    }
    else if (req.query.location) {
        getLocationUsers(req.query.location)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 유저 가져오기 실패");
            });
    }
    else if (req.query.field) {
        getFieldUsers(req.query.field)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 유저 가져오기 실패");
            });
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