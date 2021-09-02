// ----------------------------------------------------------------
var router = require('express').Router();
var ObjectId = require('mongodb').ObjectID;
var UserData = require('../models/userData');
var User = require('../models/user');
var Post = require('../models/post');
var Project = require('../models/project');
// ----------------------------------------------------------------

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

// ----------------------------------------------------------------

//==== 해당 이메일이 존재하는지 확인하는 함수 =========================
// 자기자신 추가못하게 reject하는 기능 추가하기
function isEmailExist(email) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            user_email: email
        }).then((user) => {
            if (user == null) { // 존재하면 1, 존재하지않으면 0을 보냄
                resolve([200, 0]);
            } else {
                resolve([200, 1]);
            }
        }).catch((err) => {
            reject(500);
        });
    });
};

//==== 프로젝트 생성하는 함수 =========================
function createProject(email, data) {
    return new Promise(function (resolve, reject) {
        var newProject = new Project(data);
        UserData.findOne({
            user_email: email
        }).then(user => {
            newProject.project_title = data.project_title;
            newProject.project_leader.id = user._id; // 팀 리더 정보
            newProject.project_leader.email = user.user_email;
            newProject.project_leader.name = user.user_name;
            newProject.project_leader.img = user.user_img;
            newProject.save((err) => { // 프로젝트 저장
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

//==== 프로젝트 멤버정보 채우는 함수 =========================
function addMemberInfo(email, data) {
    return new Promise(function (resolve, reject) {

    });
};

//==== 멤버별로 프로젝트정보 넣는 함수 =========================
function addUserProject(email, data) {
    return new Promise(function (resolve, reject) {

    });
};

//==== 프로젝트 수정하는 함수 =========================
function updateProject(email, data) {
    return new Promise(function (resolve, reject) {

    });
};

//==== 팀원평가 함수 =========================
// 자기자신은 평가못함
function evaluateUser(email, idData, data) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({
            user_email: email
        }).then((user) => {
            UserData.updateOne(
                { _id: idData },
                {
                    $set: {
                        'user_evaluation.member_name': user.user_name, // 현재평가하는사람
                        'user_evaluation.evaluation_date': getCurrentDate(), // 현재날짜
                        'user_evaluation.project_title': data.project_title, // 프로젝트제목
                        'user_evaluation.q1': data.user_evaluation.q1, // 유저평가
                        'user_evaluation.q2': data.user_evaluation.q2,
                        'user_evaluation.q3': data.user_evaluation.q3,
                        'user_evaluation.q4': data.user_evaluation.q4,
                        'user_evaluation.q5': data.user_evaluation.q5,
                    }
                }
            ).then(() => {
                resolve(200);
            }).catch((err) => {
                reject(404);
            })
        }).catch((err) => {
            reject(401);
        });
    });
};

// ----------------------------------------------------------------

//==== 진행중인 프로젝트드 조회 =============================
router.get('/', function (req, res, next) {
    functionname()
        .then((code) => {
            res.status(code).send(code + ": 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 실패");
        });
});

//==== 이메일과 일치하는 유저가 있는지 확인 =============================
router.get('/check/:email', function (req, res, next) {
    isEmailExist(req.params.email)
        .then((data) => {
            res.status(data[0]).send({ result: data[1] });
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 유저 확인 실패");
        });
});

//==== id와 일치하는 프로젝트 조회 =============================
router.get('/:id', function (req, res, next) {
    functionname()
        .then((code) => {
            res.status(code).send(code + ": 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 실패");
        });
});

//==== 프로젝트 삭제 =============================
router.get('/delete/:id', function (req, res, next) {
    functionname()
        .then((code) => {
            res.status(code).send(code + ": 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 실패");
        });
});

//==== 프로젝트 종료 =============================
router.get('/end/:id', function (req, res, next) {
    functionname()
        .then((code) => {
            res.status(code).send(code + ": 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 실패");
        });
});

//==== 프로젝트 평가페이지 =============================
// 팀원평가 모두 했는지 확인도 하는 기능 필요
// 자기자신은 평가못함?
router.get('/eval/:id', function (req, res, next) {
    functionname()
        .then((code) => {
            res.status(code).send(code + ": 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 실패");
        });
});

//==== 프로젝트 생성 =============================
router.post('/create', function (req, res, next) {
    createProject(req.user.user_email, req.body)
        .then((code) => {
            res.status(code).send(code + ": 프로젝트 생성 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 프로젝트 생성 실패");
        });
});

//==== 프로젝트 수정 =============================
router.post('/update/:id', function (req, res, next) {
    functionname()
        .then((code) => {
            res.status(code).send(code + ": 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 실패");
        });
});

//==== id와 일치하는 팀원 평가 =============================
router.post('/eval/:id/:userid', function (req, res, next) {
    evaluateUser(req.user.user_email, req.params.id, req.body)
        .then((code) => {
            res.status(code).send(code + ": 평가 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 평가 실패");
        }); s
});

// ----------------------------------------------------------------

module.exports = router;