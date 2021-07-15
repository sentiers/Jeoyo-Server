module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/401');
    },
  };

  //https://github.com/bradtraversy/node_passport_login/blob/master/config/auth.js