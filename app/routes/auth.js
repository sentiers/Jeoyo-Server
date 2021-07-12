//====HANDLE AUTHORIZATION ROUTES ============================
var router = require('express').Router();
var User   = require('../models/user');
var UserAccount   = require('../models/userAccount');


//====UTILITY FUNCTIONS========================================

//====유저 등록 =========================
function registerUser(){

}

//====유저 확인 =========================
function checkUser(){

}


//====GET REQUESTS============================================
//=====POST REQUESTS==========================================

//====테스팅 용도 =========================
router.get('/', function (req, res, next) {
    res.send("hello auth");
});

//====회원가입 ============================
router.post('/register', function (req, res, next) {
    res.send("registering");
});

//====설문조사 =============================
router.post('/survey', function (req, res, next) {
    res.send("surveying");
});

//====비밀번호찾기 =========================
router.post('/find', function (req, res, next) {
    res.send("finding");
});

//====로그인 =============================
router.post('/login', function (req, res, next) {
    res.send("login");
});

//====비밀번호 변경 =============================
router.post('/update', function (req, res, next) {
    res.send("updating");
});

//====로그아웃 =============================
router.get('/logout', function (req, res, next) {
    res.send("logout");
});

//====google 계정으로 로그인 =================
router.get('/', function (req, res, next) {

});

module.exports = router;