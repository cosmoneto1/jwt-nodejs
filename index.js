var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jwt-simple");
var auth = require("./auth.js")();
var users = require("./users.js");
var cfg = require("./config.js");
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(auth.initialize());


app.get("/", function(req, res) {
  res.json({status: "My API is alive!"});
});

app.get("/user", auth.authenticate(), function(req, res) {
	 //retorna o user
  res.json(users[req.user.index]);
});

app.post("/token", function(req, res) {
	console.log(req.body);
  if (req.body.email && req.body.password) {
    var email = req.body.email;
    var password = req.body.password;
    var user = users.find(function(u) {
      return u.email === email && u.password === password;
    });
    if (user) {
      var payload = {id: user.id};
      var token = jwt.encode(payload, cfg.jwtSecret);
      res.json({token: token});
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});






app.listen(3000, function() {
  console.log("My API is running...");
});


module.exports = app;