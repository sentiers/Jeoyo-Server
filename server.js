//https://fierce-mesa-76163.herokuapp.com/

//====DEPENDENCIES =========================================
var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

//====ROUTES================================================
var root = require(__dirname + '/app/routes/root');
var auth = require(__dirname + '/app/routes/auth');
var chat = require(__dirname + '/app/routes/menu-chat');
var post = require(__dirname + '/app/routes/menu-explore-post');
var explore = require(__dirname + '/app/routes/menu-explore');
var home = require(__dirname + '/app/routes/menu-home');
var mypage = require(__dirname + '/app/routes/menu-mypage');

//====MONGOOOSE AND MONGOD==================================
var url = 'mongodb+srv://dbUser:2021JeoyoApp@jeoyocluster.evzle.mongodb.net/JeoyoDatabase?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

//====CONFIGURATION OF EXPRESS AND PASSPORT=================
app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: '2021jeoyoapp2021',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 5
  },
  resave: false, // maybe true
  saveUninitialized: false // maybe true
}));
app.use(passport.initialize());
app.use(passport.session());
require(path.join(__dirname, 'app', 'config', 'strategies'))(passport);

//====ROUTING===============================================
app.use('/', root);
app.use('/auth', auth);
app.use('/chat', chat);
app.use('/post', post);
app.use('/explore', explore);
app.use('/home', home);
app.use('/mypage', mypage);

//====LISTEN TO THE SERVER =================================
app.listen(process.env.PORT || 8080,
  () => console.log('Started server at localhost:8080'));