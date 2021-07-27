//====HANDLE POST ROUTES =============
var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
// ----------------------------------------------------------------

//==== 모든 유저 가져오기 =========================
function getAllUsers(email) {
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
//==== GET 모든 유저 가져오기 =============================
router.get('/all', function (req, res, next) {
    getAllUsers()
        .then((data) => {
            res.status(data[0]).send(data[1]);
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 모든 유저 가져오기 실패");
        });
});

module.exports = router;