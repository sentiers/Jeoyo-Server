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

//==== 모든 프로젝트 가져오는 함수 =========================
// user_project에 있는 프로젝트만 쭉가져오기
function getAllMyProject() {
    return new Promise(function (resolve, reject) {
        Project.find()
            .sort({ "project_active": 1 }) // 진행중(1) - 평가중(2) - 종료(3) 순
            .then(project => {
                resolve([200, project]);
            }).catch((err) => {
                reject(500);
            });
    });
};

//==== 해당 이메일이 존재하는지 확인하는 함수 =========================
function isEmailExist(email, emailData) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            user_email: emailData
        }).then((user) => {
            if (user == null) { // 존재하지않는경우
                reject(404);
            } else if (user.user_email == email) { // 자기자신 추가 못하게
                reject(403)
            }
            else { // 찾은경우
                resolve(200);
            }
        }).catch((err) => {
            reject(500);
        });
    });
};


//==== 프로젝트 id 별로 조회하는 함수 =========================
function getProjectById(idData) {
    return new Promise(function (resolve, reject) {
        Project.findOne({
            _id: idData
        }).then(project => {
            resolve([200, project]);
        }).catch((err) => {
            reject(404);
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

//==== 현재유저의 진행중인 프로젝트들 조회 =============================
router.get('/', function (req, res, next) {
    getAllMyProject()
        .then((data) => {
            res.status(data[0]).send(data[1]);
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 프로젝트 가져오기 실패");
        });
});

//==== 이메일과 일치하는 유저가 있는지 확인 =============================
router.get('/check/:email', function (req, res, next) {
    isEmailExist(req.user.user_email, req.params.email)
        .then((code) => {
            res.status(code).send(code + ": 유저 추가 가능");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 유저 추가 불가능");
        });
});

//==== id와 일치하는 프로젝트 조회 =============================
router.get('/:id', function (req, res, next) {
    getProjectById(req.params.id)
        .then((code) => {
            res.status(code).send(code + ": 프로젝트 가져오기 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 프로젝트 가져오기 실패");
        });
});

//==== 프로젝트 삭제 =============================
// 프로젝트삭제는 모든팀원이 탈퇴할수있는거로? 
//-	팀장이 삭제: 프로젝트전체삭제?
//-	팀원이 삭제: 탈퇴 기능?
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