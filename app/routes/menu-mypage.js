//====HANDLE MY PAGE ROUTES =============
var router = require('express').Router();

//====테스팅 용도 =============================
router.get('/', function (req, res, next) {
    res.send("hello my page");
});

module.exports = router;