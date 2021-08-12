// -----------------------------------------------------------
var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');
// -----------------------------------------------------------

//==== 프로젝트 최신 3개씩 반환하는 함수=========================
function getRecentProjects() {
    return new Promise(function (resolve, reject) {
        Post.find({ post_division: { $in: ["공모전", "대외활동"] } }) 
            .limit(3).then((activity) => { // 공모전 게시물 3개 제한
                Post.find({ post_division: "스터디" }) 
                    .limit(3).then((study) => { // 스터디 게시물 3개 제한
                        Post.find({ post_division: "동아리" })
                            .limit(3).then((club) => { // 동아리 게시물 3개 제한
                                resolve([200, activity, study, club]);
                            }).catch((err) => {
                                reject(500);
                            });
                    }).catch((err) => {
                        reject(500);
                    });
            }).catch((err) => {
                reject(500);
            });
    });
};

//==== 같은지역 유저 10명 반환하는 함수=========================
function getNearUsers(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            user_email: email
        }).then(user => {
            UserData.aggregate([
                {
                    "$match": {
                        "$and": [
                            { "user_location": { "$in": user.user_location } }, // 지역이 일치하는 유저들
                            { "user_email": { "$ne": user.user_email } } // 현재유저를 제외
                        ]
                    }
                },
                {
                    "$sample": { size: 10 } // 랜덤으로 10명만 반환
                }
            ]).then(users => {
                resolve([200, users]);
            }).catch((err) => {
                reject(500);
            });
        }).catch((err) => {
            reject(401);
        });
    });
};

// ----------------------------------------------------------------

//==== GET 홈페이지 화면 =============================
router.get('/', function (req, res, next) {
    getNearUsers(req.user.user_email)
        .then((users) => {
            getRecentProjects().then((recent) => {
                res.status(recent[0]).send({ activity: recent[1], study: recent[2], club: recent[3], users: users[1] });
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 홈 화면 데이터를 가져오지 못하였습니다");
            });
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 홈 화면 데이터를 가져오지 못하였습니다");
        });
});


module.exports = router;