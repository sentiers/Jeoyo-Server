//https://fierce-mesa-76163.herokuapp.com/


//====DEPENDENCIES =========================================
var express = require("express");
var path = require("path");
var app = express();


//====ROUTES=================================================
var root = require(__dirname + '/app/routes/root')

//====MONGOOOSE AND MONGOD==========================================


//====CONFIGURATION OF EXPRESS AND PASSPORT======================
app.use(express.static(path.join(__dirname,'app')));

//====ROUTING=====================================================
app.use('/', root);


//====LISTEN TO THE SERVER =======================================
app.listen(process.env.PORT || 8080,
  () => console.log('started server at localhost:8080'));