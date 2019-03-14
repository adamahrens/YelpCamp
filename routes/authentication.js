var express          = require('express')
var router           = express.Router();
var User             = require('../models/user');
var passport         = require('passport');
var LocalStrategy    = require('passport-local');
var passportMongoose = require('passport-local-mongoose');

// Auth Routes
router.get('/register', function(request, response) {
  response.render('./register/auth-form', { action: '/register', buttonText: 'Register' });
});

router.post('/register', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  User.register(new User({ username: username }), password, function(error, user) {
    if (error) {
      console.log('Error registering user ' + error);
      return response.render('./register/auth-form', { action: '/register', buttonText: 'Register' });
    } else {
      console.log('Registered User: Time to auth' + user);

      // Could be twitter, facebook, etc
      passport.authenticate('local')(request, response, function() {
        response.redirect('/campgrounds');
      });
    }
  });
});

router.get('/login', function(request, response) {
  response.render('./register/auth-form', { action: '/login', buttonText: 'Login' });
});

router.post('/login',
          passport.authenticate('local', { successRedirect: '/campgrounds', failureRedirect: '/login'}),
          function(request, response) {
});

router.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/login');
});

module.exports = router;
