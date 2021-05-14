const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');
const crypto = require('crypto');

const nodemailer = require('nodemailer');
const router = express.Router();

require('dotenv').config();


router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, name, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }
    const hash_password = await bcrypt.hash(password, 12);
    const key_one=crypto.randomBytes(256).toString('hex').substr(100, 5);
    const key_two=crypto.randomBytes(256).toString('base64').substr(50, 5);
    const key_for_verify=key_one+key_two;

    await User.create({
      email,
      name,
      password: hash_password,
      key_for_verify: key_for_verify,
    });
    
    const user_email = req.body.email;
    console.log(user_email);
    
    const transporter = nodemailer.createTransport({
      service:'gmail',
      host:'smtp.gmail.com',
      auth: {
        user: process.env.checkemail,
        pass: process.env.checkpassword
      }
    });

    var url = 'http://' + req.get('host')+'/confirmEmail'+'?key='+key_for_verify;
    //옵션
    var mailOpt = {
        from: process.env.checkemail,
        to: user_email,
        subject: '이메일 인증을 진행해주세요.',
        html : '<h1>이메일 인증을 위해 URL을 클릭해주세요.</h1><br>'+url
    };
    //전송
    transporter.sendMail(mailOpt, function(err, res) {
        if (err) {
            console.log(err);
        } else {
             console.log('email has been sent.');
        }
        Transport.close();
    });
    res.send('<script type="text/javascript">alert("이메일을 확인하세요."); window.location="/"; </script>');
    
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});



router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});


module.exports = router;
