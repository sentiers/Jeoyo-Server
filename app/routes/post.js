// --------------------------------------------------------
var router = require('express').Router();
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var UserData = require('../models/userData');
var Post = require('../models/post');
// --------------------------------------------------------

// 현재 날짜 반환하는 함수
function getCurrentDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    return new Date(Date.UTC(year, month, today));
};

// 현재 날짜, 시간 반환하는 함수
function getCurrentDateTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
};

// --------------------------------------------------------

//==== 게시물 id 별로 조회하는 함수 =========================
function getPostById(email, idData) {
    return new Promise(function (resolve, reject) {
        Post.findOne({
            _id: idData
        }).then(post => {
            if (post.post_user_email == email) {
                resolve([200, post]);
            }
            else {
                UserData.updateOne( // 이미 최근본 프로젝트에 존재한다면 기록삭제
                    { user_email: email },
                    {
                        $pull: { 'user_recent_posts': ObjectId(idData) }
                    }
                ).then(() => {
                    UserData.updateOne( // 가장 최근쪽으로 프로젝트를 최근 본 프로젝트에 푸시
                        { user_email: email },
                        {
                            $push: {
                                'user_recent_posts': {
                                    $each: [post._id],
                                    $position: 0
                                }
                            }
                        }
                    ).then(() => {
                        resolve([200, post]);
                    }).catch((err) => {
                        reject(401);
                    });
                }).catch((err) => {
                    reject(401);
                });
            }
        }).catch((err) => { // 게시물이 삭제되거나 찾을수없을때
            reject(404);
        });
    });
};

//==== 게시물 조회수올리는 함수 =========================
function IncView(idData) {
    return new Promise(function (resolve, reject) {
        Post.updateOne(
            { _id: idData },
            {
                $inc: {
                    'post_popularity': 1, // 인기도 1 올림
                    'post_view': 1 // 조회수 1 올림
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(404);
        });
    });
};

//==== 하트가 차있는지 아닌지 확인하는 함수 ================
function isLiked(email, idData) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            $and: [// 관심프로젝트에 이미 존재하는지 확인
                { user_email: email },
                { user_likedPosts: { $elemMatch: { $eq: ObjectId(idData) } } }
            ]
        }).then((user) => {
            if (user) {
                resolve(1); // 존재시 1 반환
            } else {
                resolve(0); // 존재하지 않을시 0 반환
            }
        })
    });
};

//==== 관심프로젝트 추가/삭제 함수 =========================
function likeProject(email, idData, isLiked) {
    return new Promise(function (resolve, reject) {
        if (isLiked == 1) { // 이미 관심 프로젝트일때
            UserData.updateOne(
                { user_email: email },
                {
                    $pull: { 'user_likedPosts': ObjectId(idData) } // 관심프로젝트에서 제거
                }
            ).then(() => {
                Post.updateOne(
                    { _id: idData },
                    {
                        $inc: {
                            'post_popularity': -5 // 인기도 -5
                        }
                    }
                ).then(() => {
                    resolve(200);
                }).catch((err) => {
                    reject(500);
                });
            }).catch((err) => {
                reject(500);
            });
        } else { // 관심 프로젝트에 있지않을떄
            UserData.updateOne(
                { user_email: email },
                {
                    $push: { // 관심 프로젝트에 추가
                        'user_likedPosts': {
                            $each: [ObjectId(idData)],
                            $position: 0
                        }
                    }
                }
            ).then(() => {
                Post.updateOne(
                    { _id: idData },
                    {
                        $inc: {
                            'post_popularity': 5 // 인기도 +5
                        }
                    }
                ).then(() => {
                    resolve(200);
                }).catch((err) => {
                    reject(500);
                });
            }).catch((err) => {
                reject(500);
            });
        }
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
                    post_field: field,
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_popularity": -1 }).then(post => { // 인기도 정렬
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
        } else if (sort == "모집마감순") {
            Post.find(
                {
                    post_division: division,
                    post_location: { $elemMatch: { $eq: location } },
                    post_field: field,
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_recruit_end": 1 }).then(post => { // 모집마감순 정렬
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
        } else {
            Post.find(
                {
                    post_division: division,
                    post_location: { $elemMatch: { $eq: location } },
                    post_field: field,
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_created_at": -1 }).then(post => { // 최신순 정렬
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
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
                post_field: field,
                post_recruit_end: { $gte: getCurrentDate() }
            }
        ).sort({ "post_created_at": -1 }).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(500);
        });
    });
};

//==== 게시물 구분 & 지역 & 정렬 필터=========================
function getDivisionLocationSortPosts(division, location, sort) {
    return new Promise(function (resolve, reject) {
        if (sort == "인기순") {
            Post.find(
                {
                    post_division: division,
                    post_location: { $elemMatch: { $eq: location } },
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_popularity": -1 }).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
        } else if (sort == "모집마감순") {
            Post.find(
                {
                    post_division: division,
                    post_location: { $elemMatch: { $eq: location } },
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_recruit_end": 1 }).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
        } else {
            Post.find(
                {
                    post_division: division,
                    post_location: { $elemMatch: { $eq: location } },
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_created_at": -1 }).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
        }

    });
};

//==== 게시물 구분 & 분야 & 정렬 필터=========================
function getDivisionFieldSortPosts(division, field, sort) {
    return new Promise(function (resolve, reject) {
        if (sort == "인기순") {
            Post.find(
                {
                    post_division: division,
                    post_field: field,
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_popularity": -1 }).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
        } else if (sort == "모집마감순") {
            Post.find(
                {
                    post_division: division,
                    post_field: field,
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_recruit_end": 1 }).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
        } else {
            Post.find(
                {
                    post_division: division,
                    post_field: field,
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_created_at": -1 }).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
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
                post_recruit_end: { $gte: getCurrentDate() }
            }
        ).sort({ "post_created_at": -1 }).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(500);
        });
    });
};

//==== 게시물 구분 & 분야 필터=========================
function getDivisionFieldPosts(division, field) {
    return new Promise(function (resolve, reject) {
        Post.find(
            {
                post_division: division,
                post_field: field,
                post_recruit_end: { $gte: getCurrentDate() }
            }
        ).sort({ "post_created_at": -1 }).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(500);
        });
    });
};

//==== 게시물 구분 & 정렬 필터=========================
function getDivisionSortPosts(division, sort) {
    return new Promise(function (resolve, reject) {
        if (sort == "인기순") {
            Post.find(
                {
                    post_division: division,
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_popularity": -1 }).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
        } else if (sort == "모집마감순") {
            Post.find(
                {
                    post_division: division,
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_recruit_end": 1 }).then(post => {
                console.log("하하");
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
        } else {
            Post.find(
                {
                    post_division: division,
                    post_recruit_end: { $gte: getCurrentDate() }
                }
            ).sort({ "post_created_at": -1 }).then(post => {
                resolve([200, post]);
            }).catch((err) => {
                reject(500);
            });
        }
    });
};

//==== 게시물 구분 필터=========================
function getDivisionPosts(division) {
    return new Promise(function (resolve, reject) {
        Post.find(
            {
                post_division: division,
                post_recruit_end: { $gte: getCurrentDate() }
            }
        ).sort({ "post_created_at": -1 }).then(post => {
            resolve([200, post]);
        }).catch((err) => {
            reject(500);
        });
    });
};

//==== 모든 게시물 가져오는 함수 =========================
function getAllPosts() {
    return new Promise(function (resolve, reject) {
        Post.find({
            post_recruit_end: { $gte: getCurrentDate() }
        }).sort({ "post_created_at": -1 }).then(data => {
            resolve([200, data]);
        }).catch((err) => {
            reject(500);
        });
    });
};

//==== 게시물 삭제하는 함수 =========================
function deletePostById(email, idData) {
    return new Promise(function (resolve, reject) {
        Post.findOne({
            _id: idData
        }).then(post => {
            if (post.post_user_email == email) {
                Post.deleteOne({
                    _id: idData
                }).then(() => {
                    resolve(200);
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


//==== 게시물 생성하는 함수 =========================
function createPost(email, data) {
    return new Promise(function (resolve, reject) {
        var newPost = new Post(data);
        UserData.findOne({
            user_email: email
        }).then(user => {
            newPost.post_location = user.user_location;
            newPost.post_user_email = user.user_email;
            newPost.post_user_name = user.user_name;
            newPost.post_recruit_start = getCurrentDate(); // 모집시작 현재날짜
            newPost.post_created_at = getCurrentDateTime(); // 게시물생성시점 현재날짜시간
            newPost.post_updated_at = getCurrentDateTime();
            newPost.save((err) => { // 게시물 저장
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
                                    'post_updated_at': getCurrentDateTime() // 게시물수정시점 현재날짜시간
                                }
                            }).then(() => {
                                resolve(200);
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
    IncView(req.params.id).then(() => {
        getPostById(req.user.user_email, req.params.id).then((data) => {
            isLiked(req.user.user_email, req.params.id).then((liked) => {
                res.status(data[0]).send({ user: data[1], isLiked: liked });
            })
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
        });
    }).catch((errcode) => {
        res.status(errcode).send(errcode + ": 게시물 가져오기 실패");
    });
});

//==== GET 해당 id 프로젝트 관심 프로젝트로 추가/삭제 =============================
router.get('/like/:id', function (req, res, next) {
    isLiked(req.user.user_email, req.params.id)
        .then((liked) => {
            likeProject(req.user.user_email, req.params.id, liked)
                .then((code) => {
                    res.status(code).send(code + ": 관심프로젝트 추가/삭제 성공");
                }).catch((errcode) => {
                    res.status(errcode).send(errcode + ": 관심프로젝트 추가/삭제 실패");
                });
        })
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
            res.status(code).send(code + ": 게시물 삭제 성공");
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

// --------------------------------------------------------

module.exports = router;