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
            reject(404);
        });
    });
};

//==== 게시물 구분 & 지역 & 분야 & 정렬 필터=========================
function getDivisionLocationFieldSortPosts(division, location, field, sort) {
    return new Promise(function (resolve, reject) {
        if (sort == "인기순") {
            Post.find(
                {
                    post_division: division,
                    post_location: { $elemMatch: { $eq: location } },
                    post_field: field
                }
            ).sort({ "post_popularity": 1 }).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(404);
            });
        } else if (sort == "모집마감순") {
            Post.find(
                {
                    post_division: division,
                    post_location: { $elemMatch: { $eq: location } },
                    post_field: field
                }
            ).sort({ "post_recuit_end": 1 }).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(404);
            });
        } else {
            Post.find(
                {
                    post_division: division,
                    post_location: { $elemMatch: { $eq: location } },
                    post_field: field
                }
            ).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(404);
            });
        }
    });
};

//==== 게시물 구분 & 지역 & 분야 필터=========================
function getDivisionLocationFieldPosts(division, location, field) {
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
            reject(404);
        });
    });
};

//==== 게시물 구분 & 지역 & 정렬 필터=========================
function getDivisionLocationSortPosts(division, location, sort) {
    return new Promise(function (resolve, reject) {
        if (sort == "인기순") {

        } else if (sort == "모집마감순") {

        } else {
            Post.find(
                {
                    post_division: division,
                    post_location: { $elemMatch: { $eq: location } }
                }
            ).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(404);
            });
        }

    });
};

//==== 게시물 구분 & 분야 & 정렬 필터=========================
function getDivisionFieldSortPosts(division, field, sort) {
    return new Promise(function (resolve, reject) {
        if (sort == "인기순") {

        } else if (sort == "모집마감순") {

        } else {
            Post.find(
                {
                    post_division: division,
                    post_field: field
                }
            ).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(404);
            });
        }
    });
};

//==== 게시물 구분 & 지역 필터=========================
function getDivisionLocationPosts(division, location) {
    return new Promise(function (resolve, reject) {
        Post.find(
            {
                post_division: division,
                post_location: { $elemMatch: { $eq: location } },
            }
        ).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(404);
        });
    });
};

//==== 게시물 구분 & 분야 필터=========================
function getDivisionFieldPosts(division, field) {
    return new Promise(function (resolve, reject) {
        Post.find(
            {
                post_division: division,
                post_field: field
            }
        ).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(404);
        });
    });
};

//==== 게시물 구분 & 정렬 필터=========================
function getDivisionSortPosts(division, sort) {
    return new Promise(function (resolve, reject) {
        if (sort == "인기순") {

        } else if (sort == "모집마감순") {

        } else {
            Post.find(
                {
                    post_division: division
                }
            ).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(404);
            });
        }
    });
};

//==== 게시물 구분 필터=========================
function getDivisionPosts(division) {
    return new Promise(function (resolve, reject) {
        Post.find(
            {
                post_division: division
            }
        ).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(404);
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
                reject(404);
            });
    });
};

//==== 게시물 삭제하기 =========================
function deletePostById(email, idData) {
    return new Promise(function (resolve, reject) {
        Post.findOne({
            _id: idData
        }).then(post => {
            if (post.post_user_email == email) {
                Post.deleteOne({
                    _id: idData
                }).then(() => {
                    resolve([200, post]);
                }).catch(() => {
                    reject(500);
                });
            } else {
                reject(403);
            }
        }).catch((err) => {
            reject(404);
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
            newPost.post_user_email = user.user_email;
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

//==== 게시물 수정 =========================
function updatePost(email, idData, data) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({ user_email: email })
            .then(user => {
                Post.findOne({
                    _id: idData
                }).then(post => {
                    if (post.post_user_email == email) {
                        Post.updateOne(
                            { _id: idData },
                            {
                                $set: {
                                    'post_division': data.post_division,
                                    'post_field': data.post_field,
                                    'post_title': data.post_title,
                                    'post_recruit_end': data.post_recruit_end,
                                    'post_requirements.status': data.post_requirements.status,
                                    'post_requirements.field': data.post_requirements.field,
                                    'post_requirements.headcount': data.post_requirements.headcount,
                                    'post_location': user.user_location,
                                    'post_meeting': data.post_meeting,
                                    'post_user_name': user.user_name,
                                    'post_introduction': data.post_introduction,
                                    'post_plan': data.post_plan,
                                    'post_preference': data.post_preference,
                                    'post_detailed': data.post_detailed,
                                    'post_updated_at': moment().format('YYYY-MM-DD HH:mm:ss')
                                }
                            }).then(() => {
                                resolve([200, post]);
                            }).catch(() => {
                                reject(500);
                            });
                    } else {
                        reject(403);
                    }
                }).catch((err) => {
                    reject(404);
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

//==== GET 게시물 삭제하기 =============================
router.get('/delete/:id', function (req, res, next) {
    deletePostById(req.user.user_email, req.params.id)
        .then((code) => {
            res.status(code).send("게시물 삭제 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 게시물 삭제 실패");
        });
});

//==== POST 게시물 만들기 =============================
router.post('/create', function (req, res, next) {
    createPost(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 게시물 생성 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 게시물 생성 실패");
        });
});

//==== POST 게시물 수정하기 =============================
router.post('/update/:id', function (req, res, next) {
    updatePost(req.user.user_email, req.params.id, req.body)
        .then((code) => {
            res.status(code).send(code + ": 게시물 수정 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 게시물 수정 실패");
        });
});

module.exports = router;