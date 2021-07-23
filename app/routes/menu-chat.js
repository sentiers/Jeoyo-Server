//====HANDLE CHAT ROUTES =============
var router = require('express').Router();

//====테스팅 용도 =============================
router.get('/', function (req, res, next) {
    res.send(req.user);
});


module.exports = router;