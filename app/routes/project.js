// ----------------------------------------------------------------
var router = require('express').Router();
var ObjectId = require('mongodb').ObjectID;
var UserData = require('../models/userData');
var Post = require('../models/post');
var Project = require('../models/project');
// ----------------------------------------------------------------

//====테스팅 용도 =============================
router.get('/', function (req, res, next) {
    res.send(req.user);
});

// ----------------------------------------------------------------

module.exports = router;