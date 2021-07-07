// google 계정으로 로그인

// 회원가입

// 그냥로그인

// 로그아웃

//====HANDLE AUTHORIZATION ROUTES =============
var router = require('express').Router();

//====DISPLAY =============================
// 테스팅 용도
router.get('/', function (req, res, next) {
    res.send("hello auth");
});

module.exports = router;