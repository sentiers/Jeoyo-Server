// ----------------------------------------------------------------
var router = require('express').Router();
var delay = require('delay');
var UserData = require('../models/userData');
var Post = require('../models/post');
// ----------------------------------------------------------------

//==== 인기있는 프로젝트 =========================
function getPopularProjects() {
    return new Promise(function (resolve, reject) {
        Post.find().sort({ "post_popularity": 1 }) // 인기도순으로 정렬
            .limit(3) // 3개로 제한
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
                        "$match": { // 현재유저의 최근본프로젝트와 일치하는 프로젝트들 가져오기
                            "_id": { "$in": user.user_recent_posts }
                        }
                    },
                    {
                        "$addFields": {
                            "order": { // 최근 본 프로젝트 순서대로 Order필드에 순서를 넣기
                                "$indexOfArray": [
                                    user.user_recent_posts,
                                    "$_id"
                                ]
                            }
                        }
                    },
                    {
                        "$sort": { "order": 1 } // Order대로 정렬하기 
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

// ----------------------------------------------------------------

module.exports = router;