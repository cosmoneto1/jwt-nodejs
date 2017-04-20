var passport = require("passport");
var passportJWT = require("passport-jwt");
var users = require("./users.js");
var cfg = require("./config.js");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
  secretOrKey: cfg.jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {

  var strategy = new Strategy(params, function(payload, done) {
    //console.log(payload.id);

   var index = users.findIndex(item => item.id==payload.id);

   console.log(index);

    //console.log(users[payload.id]);
    var user = users[index] || null;
    if (user) {
      console.log(user);
      return done(null, {'id': user.id, 'index': index});
    } else {
      return done(new Error("Usuário não encontrado"), null);
    }
  });

  passport.use(strategy);
  return {
    initialize: function() {
      return passport.initialize();
    },
    authenticate: function() {
      return passport.authenticate("jwt", cfg.jwtSession);
    }
  };

};