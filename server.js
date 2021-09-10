// --------------------------------------------
// Hyunji Cho
// Computer Engineering student
// Dongguk University
//
// Heroku Link:
// https://fierce-mesa-76163.herokuapp.com/
//
// Project Suspended: 2021 / 09 / 11
// --------------------------------------------

//==== DEPENDENCIES =========================================
var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');

//==== ROUTES ================================================
var root = require(__dirname + '/app/routes/root');
var auth = require(__dirname + '/app/routes/auth');
var chat = require(__dirname + '/app/routes/chat');
var post = require(__dirname + '/app/routes/post');
var user = require(__dirname + '/app/routes/user');
var explore = require(__dirname + '/app/routes/explore');
var home = require(__dirname + '/app/routes/home');
var mypage = require(__dirname + '/app/routes/mypage');
var project = require(__dirname + '/app/routes/project');

//==== MONGOOOSE AND MONGODB ==================================
var url = 'mongodb+srv://dbUser:2021JeoyoApp@jeoyocluster.evzle.mongodb.net/JeoyoDatabase?retryWrites=true&w=majority';
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('MongoDB 연결...'))
  .catch((err) => console.log(err));

//==== CONFIGURATION OF EXPRESS AND PASSPORT =================
app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
require(path.join(__dirname, 'app', 'config', 'strategies'))(passport);

//==== ROUTING ===============================================
app.use('/', root);
app.use('/auth', auth);
app.use('/chat', passport.authenticate('jwt', { session: false }), chat);
app.use('/post', passport.authenticate('jwt', { session: false }), post);
app.use('/user', passport.authenticate('jwt', { session: false }), user);
app.use('/explore', passport.authenticate('jwt', { session: false }), explore);
app.use('/home', passport.authenticate('jwt', { session: false }), home);
app.use('/mypage', passport.authenticate('jwt', { session: false }), mypage);
app.use('/project', passport.authenticate('jwt', { session: false }), project);

//==== LISTEN TO THE SERVER =================================
app.listen(process.env.PORT || 8080,
  () => console.log('localhost:8080 에서 서버 시작'));