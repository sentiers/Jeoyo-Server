//====HANDLE ROOT ROUTES =============
var router = require('express').Router();

//====테스팅 용도 =============================
router.get('/', function (req, res, next) {
    res.send("환영합니다");
});

module.exports = router;