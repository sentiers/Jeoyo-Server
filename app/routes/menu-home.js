//====HANDLE HOME ROUTES =============
var router = require('express').Router();

//====테스팅 용도 =============================
router.get('/', function (req, res, next) {
    res.send("hello home");
});

module.exports = router;