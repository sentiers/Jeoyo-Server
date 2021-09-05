// ----------------------------------------------------------------
var router = require('express').Router();
var delay = require('delay');
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
function getAllMyProject(email) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({ user_email: email })
            .then((user) => {
                Project.aggregate([
                    {
                        "$match": {
                            "_id": { "$in": user.user_projects }
                        } //??????
                    }
                ]).then((posts) => {
                    resolve([200, posts]);
                }).catch((err) => {
                    console.log(err);
                    reject(500);
                });
            }).catch((err) => {
                console.log(err);
                reject(401);
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

//==== 프로젝트 삭제하는 함수 =========================
function deleteProject(email, idData) {
    return new Promise(function (resolve, reject) {
        Project.findOne({
            _id: idData
        }).then(project => {
            if (project.project_active != 1) {
                reject(400); // 프로젝트가 진행중이 아닐 경우
            }
            else if (project.project_leader.email == email) { // 팀장이 삭제하는 경우
                Project.deleteOne( // 프로젝트 삭제
                    { _id: idData }
                ).then(() => {
                    UserData.updateMany(
                        {
                            $pull: { // 각 멤버들의 프로젝트 정보 삭제
                                'user_projects': { _id: idData }
                            }
                        }
                    ).then(() => {
                        resolve(200);
                    })
                }).catch(() => {
                    reject(500);
                });
            }
            else { // 팀원이 삭제하는 경우

                Project.updateOne(
                    { _id: idData },
                    {
                        $pull: { // 프로젝트 에서 탈퇴
                            'project_member': { email: email }
                        }
                    }
                ).then(() => {
                    UserData.updateOne(
                        { user_email: email },
                        {
                            $pull: { // 탈퇴하지만 나중에 다른사람들 프로젝트 팀원평가에는 뜸
                                'user_projects': { _id: idData }
                            }
                        }
                    ).then(() => {
                        resolve(200);
                    })
                }).catch(() => {
                    reject(500);
                });
            }
        }).catch((err) => {
            reject(404);
        });
    });
};

//==== 프로젝트 종료하는 함수 =========================
function endProject(email, idData) {
    return new Promise(function (resolve, reject) {
        Project.findOne({
            _id: idData
        }).then(project => {
            if (project.project_leader.email != email) {
                reject(403); // 종료하는사람이 팀장이 아닐경우
            }
            else {
                Project.updateOne(
                    { _id: idData },
                    {
                        $set: {
                            project_active: 2 // 진행중(1)에서 평가중(2)로 변함
                        }
                    }
                ).then(() => {
                    resolve(200);
                })
            }
        }).catch((err) => {
            reject(404);
        });

    });
};

//==== 평가페이지 데이터반환 함수 =========================
function membersToEvaluate(email, idData, data) {
    return new Promise(function (resolve, reject) {
        Project.findOne({
            _id: idData
        }).then(project => {
            if (project.project_leader.email != email) {
                reject(403); // 수정하는사람이 팀장이 아닐경우
            }
            else {

            }
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
            newProject.project_leader._id = user._id; // 팀 리더 정보
            newProject.project_leader.email = user.user_email;
            newProject.project_leader.name = user.user_name;
            newProject.project_leader.img = user.user_img;
            newProject.project_created_at = getCurrentDateTime(); // 생성시점 현재날짜시간
            newProject.save((err) => { // 프로젝트 저장
                if (err) {
                    reject(500);
                } else {
                    resolve([201, newProject._id, data.user_email]);
                }
            });
        }).catch((err) => {
            reject(401);
        });
    });
};

//==== 프로젝트 멤버정보 채우는 함수 =========================
function addMemberInfo(idData, emails, emailData) {
    return new Promise(function (resolve, reject) {

        var fillInfo = async (emails) => {
            for (const email of emails) { // 이메일당 루프
                await delay().then(() => { // 루프를 위한 딜레이
                    UserData.findOne(
                        { user_email: email }
                    ).then((user) => {
                        Project.updateOne(
                            { _id: idData },
                            {
                                $push: { // 프로젝트 멤버정보를 채우기
                                    project_member: {
                                        _id: user._id,
                                        email: user.user_email,
                                        name: user.user_name,
                                        img: user.user_img
                                    }
                                }
                            }
                        ).exec()
                    })
                })
            }
        }

        var resolveFunc = async (idData, emails, emailData) => {
            await delay().then(() => {
                Project.findOne({
                    _id: idData
                }).then(project => {
                    emails.push(emailData); // 이메일 배열에 리더의 이메일도 추가
                    resolve([project._id, project.project_leader, emails, project.project_title]);
                }).catch((err) => {
                    reject();
                });
            })
        }

        fillInfo(emails).then(() => {
            resolveFunc(idData, emails, emailData);
        });

    });
};

//==== 멤버별로 프로젝트정보 넣는 함수 =========================
function addUserProject(idData, leaderData, emails, title) {
    return new Promise(function (resolve, reject) {
        var fillUserProject = async (idData, emails, memberData) => {
            for (const email of emails) { // 이메일당 루프
                await delay().then(() => { // 루프를 위한 딜레이
                    UserData.updateOne(
                        { user_email: email },
                        {
                            $push: { // 프로젝트 정보 넣기
                                user_projects: {
                                    _id: idData,
                                    project_title: title,
                                    member_to_eval: memberData // 유저데이터넣기
                                }
                            }
                        }
                    ).then(() => {
                        UserData.updateOne(
                            { user_email: email },
                            {
                                $pull: { // 평가해야할 팀원중 자기자신은 제거
                                    'user_projects.$[].member_to_eval': { email: email }
                                }
                            }
                        ).exec()
                    })
                })
            }
        }

        var findOneFunc = async (idData, leaderData, emails) => {
            await delay(100).then(() => { // 멤버데이터를 위한 딜레이
                Project.findOne({
                    _id: idData
                }).then(project => {
                    console.log(project);
                    var members = project.project_member;
                    members.push(leaderData); // 멤버데이터에 리더 데이터도 넣기
                    fillUserProject(project._id, emails, members).then(() => {
                        resolve();
                    })
                }).catch((err) => {
                    reject();
                });
            })
        }

        findOneFunc(idData, leaderData, emails);
    });
};

//==== 프로젝트 수정하는 함수 =========================
function updateProject(email, idData, data) {
    return new Promise(function (resolve, reject) {
        UserData.findOne({ user_email: email })
            .then(user => {
                Project.findOne({
                    _id: idData
                }).then(project => {
                    if (project.project_leader.email != email) {
                        reject(403); // 수정하는사람이 팀장이 아닐경우
                    } else if (project.project_active != 1) {
                        reject(400); // 프로젝트가 진행중이 아닐 경우
                    }
                    else {
                        Project.updateOne(
                            { _id: idData },
                            {
                                $set: {
                                    'project_title': data.project_title,
                                    'project_leader.name': user.user_name,
                                    'project_leader.img': user.user_img,
                                    'project_updated_at': getCurrentDateTime(), // 수정시점 현재날짜시간
                                    'project_member': [] // 기존 멤버 비우기
                                }
                            }
                        ).then(() => {
                            UserData.updateMany(
                                {
                                    $pull: { // 기존 멤버들의 프로젝트 정보지우기
                                        'user_projects': { _id: idData }
                                    }
                                }
                            ).then(() => {
                                resolve([200, idData, data.user_email]);
                            })
                        }).catch(() => {
                            reject(500);
                        });
                    }
                }).catch((err) => {
                    reject(404);
                });
            }).catch((err) => {
                reject(401);
            });
    });
};

//==== 팀원평가 함수 =========================
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
    getAllMyProject(req.user.user_email)
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
router.get('/delete/:id', function (req, res, next) {
    deleteProject(req.user.user_email, req.params.id)
        .then((code) => {
            res.status(code).send(code + ": 프로젝트 삭제 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 프로젝트 삭제 실패");
        });
});

//==== 프로젝트 종료 =============================
router.get('/end/:id', function (req, res, next) {
    endProject(req.user.user_email, req.params.id)
        .then((code) => {
            res.status(code).send(code + ": 프로젝트 종료 성공 - 평가 가능");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 프로젝트 종료 실패");
        });
});

//==== 프로젝트 평가페이지 =============================
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
    createProject(req.user.user_email, req.body).then((data) => {
        addMemberInfo(data[1], data[2], req.user.user_email).then((projectData) => {// 프로젝트 멤버정보 채우는 함수
            addUserProject(projectData[0], projectData[1], projectData[2], projectData[3]).then(() => {// 멤버별로 프로젝트정보 넣는 함수
                res.status(data[0]).send(data[0] + ": 프로젝트 생성 성공");
            })
        })
    }).catch((errcode) => {
        res.status(errcode).send(errcode + ": 프로젝트 생성 실패");
    });
});

//==== 프로젝트 수정 =============================
router.post('/update/:id', function (req, res, next) {
    updateProject(req.user.user_email, req.params.id, req.body).then((data) => {
        addMemberInfo(data[1], data[2], req.user.user_email).then((projectData) => {// 프로젝트 멤버정보 채우는 함수
            addUserProject(projectData[0], projectData[1], projectData[2], projectData[3]).then(() => {// 멤버별로 프로젝트정보 넣는 함수
                res.status(data[0]).send(data[0] + ": 프로젝트 수정 성공");
            })
        })
    }).catch((errcode) => {
        res.status(errcode).send(errcode + ": 프로젝트 수정 실패");
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