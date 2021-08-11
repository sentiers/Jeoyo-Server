//====HANDLE POST ROUTES =============
var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var ObjectId = require('mongodb').ObjectID;
// ----------------------------------------------------------------

//==== 유저 id 별로 조회 =========================
function getUserById(idData) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            _id: idData
        }).then(user => {
            resolve([200, user]);
        }).catch((err) => {
            reject(404);
        });
    });
};

//==== 하트가 차있는지 아닌지 확인 ================
function isLiked(email, idData) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            $and: [
                { user_email: email },
                { user_likedUsers: { $elemMatch: { $eq: ObjectId(idData) } } }
            ]
        }).then((user) => {
            if (user) {
                resolve(1);
            } else {
                resolve(0);
            }
        })
    });
};

//==== 관심유저 추가/삭제 함수 =========================
function likeUser(email, idData, isLiked) {
    return new Promise(function (resolve, reject) {
        if (isLiked == 1) {
            UserData.updateOne(
                { user_email: email },
                {
                    $pull: { 'user_likedUsers': ObjectId(idData) }
                }
            ).then(() => {
                resolve(200);
            }).catch((err) => {
                reject(500);
            });
        } else {
            UserData.updateOne(
                { user_email: email },
                {
                    $push: {
                        'user_likedUsers': {
                            $each: [ObjectId(idData)],
                            $position: 0
                        }
                    }
                }
            ).then(() => {
                resolve(200);
            }).catch((err) => {
                reject(500);
            });
        }
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
            reject(500);
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
            reject(500);
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
            reject(500);
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
                reject(500);
            });
    });
};

// ----------------------------------------------------------------

//==== GET 유저 id 별로 하나 가져오기 =============================
router.get('/:id', function (req, res, next) {
    getUserById(req.params.id)
        .then((data) => {
            isLiked(req.user.user_email, req.params.id)
                .then((liked) => {
                    res.status(data[0]).send({ user: data[1], isLiked: liked });
                })
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 유저 가져오기 실패");
        });
});

//==== GET 해당 id 유저 관심 유저로 추가/삭제 =============================
router.get('/like/:id', function (req, res, next) {
    isLiked(req.user.user_email, req.params.id)
        .then((liked) => {
            likeUser(req.user.user_email, req.params.id, liked)
                .then((code) => {
                    res.status(code).send(code + ": 관심유저 추가/삭제 성공");
                }).catch((errcode) => {
                    res.status(errcode).send(errcode + ": 관심유저 추가/삭제 실패");
                });
        })
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