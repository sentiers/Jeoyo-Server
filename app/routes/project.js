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

//==== 프로젝트 생성 =============================
router.post('/create', function (req, res, next) {
    functionname()
        .then((code) => {
            res.status(code).send(code + ": 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 실패");
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
router.post('/eval/:id', function (req, res, next) {
    functionname()
        .then((code) => {
            res.status(code).send(code + ": 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 실패");
        });
});

// ----------------------------------------------------------------

module.exports = router;