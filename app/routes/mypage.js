// --------------------------------------------------------------
var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');
// --------------------------------------------------------------

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

// ----------------------------------------------------------------

//==== 내 정보가져오는 함수 =========================
function getMyInfo(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            user_email: email
        }).then(user => {
            resolve([200, user]);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 내가 올린 모집글 데이터들 가져오는 함수 =========================
function getMyPosts(email) {
    return new Promise(function (resolve, reject) {
        Post.find({
            post_user_email: email
        }).then(data => {
            resolve([200, data]);
        }).catch((err) => {
            reject(500);
        });
    });
};

//==== 관심팀원 가져오는 함수 =========================
function getLikedUsers(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({ user_email: email })
            .then((user) => {
                UserData.aggregate([
                    {
                        "$match": {
                            "$and": [
                                { "_id": { "$in": user.user_likedUsers } },// 관심팀원에 있는 유저들
                                { 'user_active.profile': 1 } // 프로필 공개한 사람만
                            ]
                        }
                    },
                    {
                        "$addFields": {
                            "order": { // 관심팀원에 있는 유저들 순서대로 Order 필드에 순서매기기
                                "$indexOfArray": [
                                    user.user_likedUsers,
                                    "$_id"
                                ]
                            }
                        }
                    },
                    { // Order 필드로 정렬하기
                        "$sort": { "order": 1 }
                    }
                ]).then((users) => {
                    resolve([200, users]);
                }).catch((err) => {
                    reject(500);
                });
            }).catch((err) => {
                reject(401);
            });
    });
};

//==== 관심프로젝트 가져오는 함수 =========================
function getLikedProjects(email) { // 마감지난것도 보이게해놓음
    return new Promise(function (resolve, reject) {
        UserData.findOne({ user_email: email })
            .then((user) => {
                Post.aggregate([
                    {
                        "$match": { // 관심프로젝트에 있는 게시물들
                            "_id": { "$in": user.user_likedPosts }
                        }
                    },
                    {
                        "$addFields": {
                            "order": {// 관심프로젝트에 있는 게시물들 순서대로 Order 필드에 순서매기기 
                                "$indexOfArray": [
                                    user.user_likedPosts,
                                    "$_id"
                                ]
                            }
                        }
                    },
                    { // Order 필드로 정렬하기
                        "$sort": { "order": 1 }
                    }
                ]).then((posts) => {
                    resolve([200, posts]);
                }).catch((err) => {
                    reject(500);
                });
            }).catch((err) => {
                reject(401);
            });
    });
};

//==== 개인정보 수정 (한꺼번에) 함수 =========================
function updateMyInfo(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_name': data.user_name,
                    'user_gender': data.user_gender,
                    'user_education': data.user_education,
                    'user_major': data.user_major,
                    'user_location': data.user_location,
                    'user_field': data.user_field,
                    'user_updated_at' : getCurrentDateTime()
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 내 인트로수정 함수 =========================
function updateMyIntro(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_introduction': data.user_introduction,
                    'user_history': data.user_history,
                    'user_updated_at' : getCurrentDateTime() // 유저데이터 수정시점
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 내 지역 수정 함수 =========================
function updateLocation(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_location': data.user_location,
                    'user_updated_at' : getCurrentDateTime()
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 내 관심분야 수정 함수 =========================
function updateField(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_field': data.user_field,
                    'user_updated_at' : getCurrentDateTime()
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 내 설문지 수정 함수=========================
function updateSurvey(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_selection.q1': data.user_selection.q1,
                    'user_selection.q2': data.user_selection.q2,
                    'user_selection.q3': data.user_selection.q3,
                    'user_selection.q4': data.user_selection.q4,
                    'user_updated_at' : getCurrentDateTime()
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 활동설정 수정 함수 =========================
function updateActivity(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_active.profile': data.user_active.profile,
                    'user_active.myType': data.user_active.myType,
                    'user_active.teamReview': data.user_active.teamReview
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 알림설정 수정 함수=========================
function updateAlarm(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_alarm.chat': data.user_alarm.chat,
                    'user_alarm.activity': data.user_alarm.activity,
                    'user_alarm.marketing': data.user_alarm.marketing
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

// ----------------------------------------------------------------

//==== GET 내 정보 가져오기 =============================
router.get('/', function (req, res, next) {
    getMyInfo(req.user.user_email)
        .then((data) => {
            res.status(data[0]).send(data[1]);
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 유저 정보 가져오기 실패");
        });
});

//==== GET 관심팀원 가져오기 =============================
router.get('/likedusers', function (req, res, next) {
    getLikedUsers(req.user.user_email)
        .then((data) => {
            res.status(data[0]).send(data[1]);
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 관심팀원 가져오기 실패");
        });
});

//==== GET 관심프로젝트 가져오기 =============================
router.get('/likedprojects', function (req, res, next) {
    getLikedProjects(req.user.user_email)
        .then((data) => {
            res.status(data[0]).send(data[1]);
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 관심프로젝트 가져오기 실패");
        });
});

//==== GET 내가 쓴 모집글 가져오기 =============================
router.get('/posts', function (req, res, next) {
    getMyPosts(req.user.user_email)
        .then((data) => {
            res.status(data[0]).send(data[1]);
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 유저 모집글 가져오기 실패");
        });
});

//==== POST 내 정보수정(한꺼번에) =============================
router.post('/update', function (req, res, next) {
    updateMyInfo(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 유저 정보 수정 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 유저 정보 수정 실패");
        });
});

//==== POST 내 인트로수정 =============================
router.post('/updateintro', function (req, res, next) {
    updateMyIntro(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 유저 인트로 수정 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 유저 인트로 수정 실패");
        });
});

//==== POST 내 지역 수정 =============================
router.post('/location', function (req, res, next) {
    updateLocation(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 지역 수정 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 지역 수정 실패");
        });
});

//==== POST 내 관심분야 수정 =============================
router.post('/field', function (req, res, next) {
    updateField(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 관심분야 수정 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 관심분야 수정 실패");
        });
});

//==== POST 내 설문지 수정 =============================
router.post('/survey', function (req, res, next) {
    updateSurvey(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 설문 수정 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 설문 수정 실패");
        });
});

//==== POST 활동설정 수정 =============================
router.post('/activity', function (req, res, next) {
    updateActivity(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 활동설정 수정 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 활동설정 수정 실패");
        });
});

//==== POST 알림설정 수정 =============================
router.post('/alarm', function (req, res, next) {
    updateAlarm(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 알림설정 수정 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 알림설정 수정 실패");
        });
});


//==== 유저정보 최적화하는 GET 필요 =============================
// 최근 본 프로젝트에 더이상 존재하지않는 게시물이 있을 경우 삭제
// 관심 프로젝트에 더이상 존재하지않는 게시물이 있을 경우 삭제
// 관심 유저에 더이상 존재하지않는 유저가 있을 경우 삭제 


// --------------------------------------------------------------

module.exports = router;