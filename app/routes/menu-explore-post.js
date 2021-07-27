//====HANDLE POST ROUTES =============
var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
// ----------------------------------------------------------------
//==== 게시물 id 별로 조회 =========================
function getPostById(idData) {
    return new Promise(function (resolve, reject) {
        Post.findOne({
            id: idData
        }).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 게시물 생성 =========================
function createPost(email, data) {
    return new Promise(function (resolve, reject) {
        var newPost = new Post(data);
        UserData.findOne({
            user_email: email
        }).then(user => {
            newPost.post_location = user.user_location;
            newPost.post_user_id = user.id;
            newPost.post_user_name = user.user_name;
            newPost.post_recruit_start = moment().format('YYYY-MM-DD');
            newPost.post_created_at = moment().format('YYYY-MM-DD HH:mm:ss');
            newPost.save((err) => {
                if (err) {
                    reject(500);
                } else {
                    resolve(201);
                }
            });
        }).catch((err) => {
            reject(401);
        });
    });
};

// ----------------------------------------------------------------

//==== GET 게시물 id 별로 하나 가져오기 =============================
router.get('/:id', function (req, res, next) {
    console.log(req);
    console.log(req.params);
    getPostById(req.params.id)
        .then((data) => {
            res.status(data[0]).send(data[1]);
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
        });
});

//==== POST 게시물 만들기 =============================
router.post('/create', function (req, res, next) {
    createPost(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 게시물 생성 완료");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 게시물 생성 실패");
        });
});


module.exports = router;