//====HANDLE MY PAGE ROUTES =============
var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');

// ----------------------------------------------------------------

//==== 내 정보가져오기 =========================
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

//==== 내가 올린 모집글 데이터들 가져오기 =========================
function getMyPosts(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            user_email: email
        }).then(user => {
            Post.find({
                post_user_id: user.id
            }).then(data => {
                if (data.length == 0) {
                    reject(404);
                } else {
                    resolve([200, data]);
                }
            })
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 개인정보 수정 (한꺼번에) =========================
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
                    'user_field': data.user_field
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 내 인트로수정 =========================
function updateMyIntro(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_introduction': data.user_introduction,
                    'user_history': data.user_history
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 내 지역 수정 =========================
function updateLocation(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_location': data.user_location
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 내 관심분야 수정 =========================
function updateField(email, data) {
    return new Promise(function (resolve, reject) {
        UserData.updateOne(
            { user_email: email },
            {
                $set: {
                    'user_field': data.user_field
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 내 설문지 수정 =========================
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
                    'user_selection.q5': data.user_selection.q5,
                }
            }
        ).then(() => {
            resolve(200);
        }).catch((err) => {
            reject(401);
        });
    });
};

// 테스팅용 데이터보내는 함수 user_name = "keke"
function testing() {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            user_email: "1234@naver.com"
        }).then(user => {
            resolve([200, user]);
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
    //    testing()
    //        .then((data) => {
    //            res.status(data[0]).send(data[1]);
    //        }).catch((errcode) => {
    //            res.status(errcode).send(errcode + ": 유저 정보 가져오기 실패");
    //        });
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

module.exports = router;