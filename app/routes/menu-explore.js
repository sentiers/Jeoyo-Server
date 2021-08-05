//====HANDLE EXPLORE ROUTES =============
var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');
var delay = require('delay');
// ----------------------------------------------------------------

//==== 인기있는 프로젝트 =========================
function getPopularProjects() {
    return new Promise(function (resolve, reject) {
        Post.find().sort({ "post_popularity": 1 })
            .limit(3)
            .then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
    });
};

//==== 최근 본 프로젝트 =========================
function getRecentViewProjects(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({ user_email: email })
            .then((user) => {
                Post.aggregate([
                    {
                        "$match": {
                            "_id": { "$in": user.user_recent_posts }
                        }
                    },
                    {
                        "$addFields": {
                            "order": {
                                "$indexOfArray": [
                                    user.user_recent_posts,
                                    "$_id"
                                ]
                            }
                        }
                    },
                    {
                        "$sort": { "order": 1 }
                    }
                ]).limit(3)
                    .then((posts) => {
                        resolve([200, posts]);
                    }).catch((err) => {
                        reject(500);
                    });
            }).catch((err) => {
                reject(401);
            });
    });
};

// ----------------------------------------------------------------

//==== GET 탐색 화면 =============================
router.get('/', function (req, res, next) {
    getRecentViewProjects(req.user.user_email)
        .then((recent) => {
            getPopularProjects().then((popular) => {
                res.status(popular[0]).send({ popularProjects: popular[1], recentViewProjects: recent[1] });
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 탐색화면 데이터를 가져오지 못하였습니다");
            });
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 탐색화면 데이터를 가져오지 못하였습니다");
        });
});

module.exports = router;