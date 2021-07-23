//====HANDLE POST ROUTES =============
var router = require('express').Router();

//====  ============================
function registerUser(data) {
    return new Promise(function (resolve, reject) {

        
    });
};

//====테스팅 용도 =============================
router.get('/', function (req, res, next) {
    res.send("hello post");
});


//====  ============================
router.post('/register', function (req, res, next) {
    registerUser(req.body)
        .then((code) => {
            res.status(code).send(code + ": 회원가입 성공");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 회원가입 실패");
        });
});

//====  =============================
router.post('/termsofuse', function (req, res, next) {
    termsOfUse(req.session.passport.user, req.body)
        .then((code) => {
            res.status(code).send(code + ": 이용약관 동의 완료");
        }).catch((errcode) => {
            res.status(errcode).send(errcode + ": 이용약관 동의시 문제가 발생하였습니다");
        });
});














module.exports = router;