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

// jwt 잘못되면 401 뜸
 
// https://www.whatap.io/ko/blog/40/

// 200: 요청이 성공적
// 201: 성공적으로 생성되었음

// 400: 잘못된 문법
// 401: 비인증
// 403: 권한부족
// 404: NOT FOUND
// 409: 리소스와 타켓리소스가 충돌

// 500: 서버에러

// 유저 하나, 포스트하나 가져올때 
// /person/:id - path variable - req.params.id
//
// 필터링할때
// /people - query string - req.query.vin



module.exports = router;