//====HANDLE POST ROUTES =============
var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');
var moment = require('moment');
const { post } = require('./menu-home');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
// ----------------------------------------------------------------
//==== 게시물 id 별로 조회 =========================
function getPostById(idData) {
    return new Promise(function (resolve, reject) {
        Post.findOne({
            _id: idData
        }).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 게시물 구분 & 지역 & 분야 & 정렬 필터=========================
function getDivisionLocationFieldSortPosts(division, location, field, sort) {
    return new Promise(function (resolve, reject) {
        Post.find(
            {
                post_division: division,
                post_location: { $elemMatch: { $eq: location } },
                post_field: field
            }
        ).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 게시물 구분 & 지역 & 분야 필터=========================
function getDivisionLocationFieldPosts(division, location, field) {
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

//==== 게시물 구분 & 지역 & 정렬 필터=========================
function getDivisionLocationSortPosts(division, location, sort) {
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

//==== 게시물 구분 & 분야 & 정렬 필터=========================
function getDivisionFieldSortPosts(division, field, sort) {
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

//==== 게시물 구분 & 지역 필터=========================
function getDivisionLocationPosts(division, location) {
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

//==== 게시물 구분 & 분야 필터=========================
function getDivisionFieldPosts(division, field) {
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

//==== 게시물 구분 & 정렬 필터=========================
function getDivisionSortPosts(division, sort) {
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

//==== 게시물 구분 필터=========================
function getDivisionPosts(division) {
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

//==== 모든 게시물 가져오기 =========================
function getAllPosts() {
    return new Promise(function (resolve, reject) {
        Post.find()
            .then(data => {
                resolve([200, data]);
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
    getPostById(req.params.id)
        .then((data) => {
            res.status(data[0]).send(data[1]);
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
        });
});

//==== GET 게시물 필터링 =============================
router.get('/', function (req, res, next) {
    if (req.query.division && req.query.location && req.query.field && req.query.sort) {
        getDivisionLocationFieldSortPosts(req.query.division, req.query.location, req.query.field, req.query.sort)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
            });
    }
    else if (req.query.division && req.query.location && req.query.field) {
        getDivisionLocationFieldPosts(req.query.division, req.query.location, req.query.field)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
            });
    } else if (req.query.division && req.query.location && req.query.sort) {
        getDivisionLocationSortPosts(req.query.division, req.query.location, req.query.sort)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
            });
    } else if (req.query.division && req.query.field && req.query.sort) {
        getDivisionFieldSortPosts(req.query.division, req.query.field, req.query.sort)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
            });
    } else if (req.query.division && req.query.location) {
        getDivisionLocationPosts(req.query.division, req.query.location)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
            });
    } else if (req.query.division && req.query.field) {
        getDivisionFieldPosts(req.query.division, req.query.field)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
            });
    } else if (req.query.division && req.query.sort) {
        getDivisionSortPosts(req.query.division, req.query.sort)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
            });
    } else if (req.query.division) {
        getDivisionPosts(req.query.division)
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
            });
    }
    else {
        getAllPosts()
            .then((data) => {
                res.status(data[0]).send(data[1]);
            }).catch((errcode) => {
                res.status(errcode).send(errcode + ": 모든 게시물 가져오기 실패");
            });
    }
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