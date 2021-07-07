//====HANDLE CHAT ROUTES =============
var router = require('express').Router();

//====DISPLAY =============================
// 테스팅 용도
router.get('/', function (req, res, next) {
    res.send("hello chat");
});



module.exports = router;