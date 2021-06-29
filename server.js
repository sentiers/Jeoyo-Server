var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var path = require("path");
var app = express();

function onHttpStart() {
  console.log("Express http server listening on " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path
app.get("/", function (req, res) {
  res.send("hi");
});

// setup http server to listen on HTTP_PORT`
app.listen(HTTP_PORT, onHttpStart);

//test git