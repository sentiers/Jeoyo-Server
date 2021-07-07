//https://fierce-mesa-76163.herokuapp.com/

//====DEPENDENCIES =========================================
var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');

//====ROUTES=================================================
var root = require(__dirname + '/app/routes/root');
var auth = require(__dirname + '/app/routes/auth');
var chat = require(__dirname + '/app/routes/menu-chat');
var post = require(__dirname + '/app/routes/menu-explore-post');
var explore = require(__dirname + '/app/routes/menu-explore');
var home = require(__dirname + '/app/routes/menu-home');
var mypage = require(__dirname + '/app/routes/menu-mypage');

//====MONGOOOSE AND MONGOD=======================================
var url = 'mongodb+srv://dbUser:2021JeoyoApp@jeoyocluster.evzle.mongodb.net/JeoyoDatabase?retryWrites=true&w=majority';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

//====CONFIGURATION OF EXPRESS AND PASSPORT======================
app.use(express.static(path.join(__dirname, 'app')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// requires modification
app.use(session({
  secret: '2021jeoyoapp2021',
  cookie:{
    maxAge: 1000*60*60*24*5
  },
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
require(path.join(__dirname, 'app', 'config', 'strategies'))(passport);

//====ROUTING=====================================================
app.use('/', root);
app.use('/auth', auth(passport));
app.get('/auth', function(req, res){
  res.redirect('/');
});

//====LISTEN TO THE SERVER =======================================
app.listen(process.env.PORT || 8080,
  () => console.log('started server at localhost:8080'));