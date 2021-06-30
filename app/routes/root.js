// 앱 실행시 로그인이 이미 되어있으면 로그인페이지 건너뛰기?
// 오랜시간지났을때는 재 로그인해야하게?


//====HANDLE ROOT PAGE ROUTES =============
var  router= require('express').Router();

//====DISPLAY ===================================================
router.get('/hi', function(req, res, next){
    res.send("hi");
});

module.exports = router;