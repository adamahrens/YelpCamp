var express          = require('express')
var router           = express.Router();
var Campground       = require('../models/campground');

// GET
router.get('/campgrounds', function(request, response) {
  Campground.find({}, function(error, camps) {
    if (error) {
      console.log('Error fetching campgrounds ' + error);
    }

    var finalCamps = error ? [] : camps
    response.render('./campgrounds/campgrounds', { campgrounds: finalCamps });
  })
  .sort({ '_id' : -1 });
});

// CREATE
router.post('/campgrounds', loggedIn, function(request, response) {
  var n = request.body.name;
  var i = request.body.image;
  var b = request.body.blurb;

  Campground.create({ name: n, image: i, blurb: b}, function(error, obj) {
    if (error) {
      console.log("Error saving new campground to database");
    } else {
      console.log('Saved ' + obj + ' to the database');
      response.redirect('/campgrounds');
    }
  });
});

// NEW
router.get('/campgrounds/new', function(request, response) {
  response.render('./campgrounds/new');
});

// SHOW
router.get('/campground/:id', function(request, response){
  var name = request.params.id
  Campground
  .findOne({ slug: name })
  .populate('comments')
  .exec(function(error, campground) {
    if (error) {
      console.log('Error finding by slug' + error);
    } else {
      response.render('./campgrounds/show', { campground: campground });
    }
  });
});

// EDIT
router.get('/campgrounds/:id/edit', function(request, response) {
  var name = request.params.id;
  Campground.findOne({ slug: name}, function(error, campground) {
    if (error) {
      console.log('Error finding by slug ' + error);
    } else {
      response.render('./campgrounds/edit', { campground: campground});
    }
  });
});

// UPDATE
router.put('/campgrounds/:id', loggedIn,  function(request, response) {
  var name = request.params.id;
  Campground.findOneAndUpdate({ slug: name }, request.body.campground, { new: true }, function (error, campground) {
    if (error) {
      console.log('Erroring Updating campground. Redirecting... : ' + error);
      response.redirect('/campgrounds/' + name + '/edit');
    } else {
      response.redirect('/campground/' + name)
    }
  });
});

// DELETE
router.delete('/campgrounds/:id',loggedIn,  function(request, response) {
  var name = request.params.id;
});

function loggedIn(request, response, next) {
  if (request.isAuthenticated()) {
    return next()
  }

  response.redirect('/login');
}

module.exports = router;
