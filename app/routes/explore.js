// ----------------------------------------------------------------
var router = require('express').Router();
var delay = require('delay');
var UserData = require('../models/userData');
var Post = require('../models/post');
// ----------------------------------------------------------------

// 현재 날짜 반환하는 함수
function getCurrentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    return new Date(Date.UTC(year, month, today));
};

// ----------------------------------------------------------------

//==== 인기있는 프로젝트 =========================
function getPopularProjects() {
    return new Promise(function (resolve, reject) {
        Post.find({
            post_recruit_end: { $gte: getCurrentDate() } // 모집기간 안지난 프로젝트
        }).sort({ "post_popularity": -1 }) // 인기도순으로 정렬
            .limit(3) // 3개로 제한
            .then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
    });
};

//==== 최근 본 프로젝트 =========================
function getRecentViewProjects(email) { // 마감지난것도 보이게해놓음
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