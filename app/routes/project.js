// ----------------------------------------------------------------
var router = require('express').Router();
var ObjectId = require('mongodb').ObjectID;
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
var UserData = require('../models/userData');
// ----------------------------------------------------------------

//====테스팅 용도 =============================
router.get('/', function (req, res, next) {
    res.send(req.user);
});

// ----------------------------------------------------------------

module.exports = router;