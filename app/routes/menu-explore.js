//====HANDLE EXPLORE ROUTES =============
var router = require('express').Router();

var router = require('express').Router();
var UserData = require('../models/userData');
var Post = require('../models/post');

// ----------------------------------------------------------------

//==== 인기있는 프로젝트 =========================
function getPopularProjects() {
    return new Promise(function (resolve, reject) {
        // 인기 있는 프로젝트 어떻게?
    });
};

//==== 최근 본 프로젝트 =========================
function getRecentViewProjects() {
    return new Promise(function (resolve, reject) {
        // 어떻게?
    });
};

// ----------------------------------------------------------------

//==== GET 탐색 화면 =============================
router.get('/', function (req, res, next) {
    

});


module.exports = router;