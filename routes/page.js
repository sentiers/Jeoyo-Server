const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User } = require('../models');

const router = express.Router();

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird', user: req.user });
});

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입 - NodeBird',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.get('/', (req, res, next) => {
  res.render('main', {
    title: 'NodeBird',
    twits: [], 
    user: req.user,
    loginError: req.flash('loginError'),
  });
});

router.get('/confirmEmail',function (req,res) {
  User.updateOne({key_for_verify:req.query.key},{$set:{email_verified:true}}, function(err,user){
      //에러처리
      if (err) {
          console.log(err);
      }
      //일치하는 key가 없으면
      else if(user.n==0){
          res.send('<script type="text/javascript">alert("Not verified"); window.location="/"; </script>');
      }
      //인증 성공
      else {
          res.send('<script type="text/javascript">alert("Successfully verified"); window.location="/"; </script>');
      }
  });
});

/* router.get('/', (req, res, next) => {
  Post.findAll({
    include: {
      model: User,
      attributes: ['id', 'name'],
    },
    order: [['createdAt', 'DESC']],
  })
    .then((posts) => {
      res.render('main', {
        title: 'NodeBird',
        twits: posts,
        user: req.user,
        loginError: req.flash('loginError'),
      });
    })
    .catch((error) => {
      console.error(error);
      next(error);
    });
});
*/
module.exports = router;