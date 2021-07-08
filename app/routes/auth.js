//====HANDLE AUTHORIZATION ROUTES ============
var router = require('express').Router();

//====테스팅 용도 =============================
router.get('/', function (req, res, next) {
    res.send("hello auth");
});

//====회원가입 =============================
router.get('/register', function (req, res, next) {
    res.send("registering");
});

//====그냥로그인 =============================
router.get('/login', function (req, res, next) {
    res.send("login");
});

//====로그아웃 =============================
router.get('/logout', function (req, res, next) {
    res.send("logout");
});

//====google 계정으로 로그인 =================
//router.get('/', function (req, res, next) {});

module.exports = router;