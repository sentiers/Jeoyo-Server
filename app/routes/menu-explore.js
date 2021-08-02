//====HANDLE EXPLORE ROUTES =============
var router = require('express').Router();

var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');
var delay = require('delay');
// ----------------------------------------------------------------

//==== 인기있는 프로젝트 =========================
function getPopularProjects() {
    return new Promise(function (resolve, reject) {
        // 인기 있는 프로젝트 어떻게?
        Post.find().sort({ "post_popularity": 1 }).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(500);
        });
    });
};

//==== 최근 본 프로젝트 =========================
function getRecentViewProjects(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({ user_email: email }).exec().then((user) => {

            var recentViewPosts = async (user) => {
                for (const postId of user.user_recent_posts) {
                    await delay()
                        .then(() => {
                            Post.findOne({
                                _id: postId
                            }).then(post => {
                                resolve([200, post]);
                            }).catch((err) => {
                                reject(404);
                            });
                        })
                }
            }
            
            recentViewPosts(user);

        }).catch((err) => {
            reject(401);
        });

    });
};

// ----------------------------------------------------------------

//==== GET 탐색 화면 =============================
router.get('/', function (req, res, next) {
    getRecentViewProjects(req.user.user_email)
        .then((data) => {
            res.status(data[0]).send(data[1]);
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 에러");
        });
});


module.exports = router;