//====HANDLE ROOT ROUTES =============
var router = require('express').Router();

//====테스팅 용도 =============================
router.get('/', function (req, res, next) {
    res.send("환영합니다");
});

//====404 PAGE NOT FOUND=================================================
router.get('/404', function (req, res, next) {
    res.status('404').end('페이지를 찾을 수 없습니다');
});

//====500 INTERNAL SERVER ERROR=========================================
router.get('/500', function (req, res, next) {
    res.status('500').end('내부 서버 오류');
});

//====401 UNAUTHORIZED ACCESS==============================================
router.get('/401', function (req, res, next) {
    res.status('401').end('인증 실패');
})

module.exports = router;