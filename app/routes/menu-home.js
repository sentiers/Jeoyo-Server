//====HANDLE HOME ROUTES =============
var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');

// ----------------------------------------------------------------

//==== 프로젝트 최신 3개씩 =========================
function getHomeProjects() {
    return new Promise(function (resolve, reject) {
        // 공모전/대외활동  최신 3개
        // 스터디  최신 3개
        // 동아리  최신 3개
    });
};

//==== 홈페이지 같은지역 유저 10명 =========================
function getHomeUsers() {
    return new Promise(function (resolve, reject) {
        // 같은지역 팀원 10명
        //근처 유저 & 소개글까지 채워넣은 유저들을 랜덤으로 추천

    });
};

// ----------------------------------------------------------------

//==== GET 홈페이지 화면 =============================
router.get('/', function (req, res, next) {
    


});


module.exports = router;