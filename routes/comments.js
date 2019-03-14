var express          = require('express')
var router           = express.Router();
var Campground       = require('../models/campground');
var Comment          = require('../models/comment');

// NEW COMMENTS
router.get('/campgrounds/:id/comments/new', function(request, response) {
  var name = request.params.id;
  Campground.findOne({ slug: name}, function(error, campground) {
    if (error) {
      console.log('Error looking up campground to add comment to:' + error);
    } else {
      response.render('./comments/new', { campground: campground});
    }
  });
});

// CREATE COMMENTS
router.post('/campgrounds/:id/comments', loggedIn, function(request, response) {
  var name = request.params.id;
  Campground.findOne({ slug: name}, function(error, campground) {
    if (error) {
      console.log('Error looking up campground to add comment to:' + error);
    } else {
      console.log('Creating comment for a campground')
      // Create Comment
      Comment.create(request.body.comment, function(error, comment) {
        if (error) {
          console.log("Error saving comment to campground1");
        } else {
          campground.comments.push(comment);
          campground.save();
          console.log('Added a comment to campground1');
          response.redirect('/campground/' + name)
        }
      });
    }
  });
});

function loggedIn(request, response, next) {
  if (request.isAuthenticated()) {
    return next()
  }

  response.redirect('/login');
}

module.exports = router;
