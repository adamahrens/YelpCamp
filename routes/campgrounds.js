var express          = require('express')
var router           = express.Router();
var Campground       = require('../models/campground');

// GET
router.get('/campgrounds', function(request, response) {
  Campground.find({}, function(error, camps) {
    if (error) {
      console.log('Error fetching campgrounds ' + error);
      request.flash('danger', 'Unable to fetch campgrounds');
      response.redirect('/');
      return
    } else {
      var finalCamps = error ? [] : camps
      response.render('./campgrounds/campgrounds', { campgrounds: finalCamps });
    }
  })
  .sort({ '_id' : -1 });
});

// CREATE
router.post('/campgrounds', loggedIn, function(request, response) {
  var n = request.body.name;
  var i = request.body.image;
  var p = request.body.price;
  var b = request.body.blurb;

  Campground.create({ name: n, price: p, image: i, blurb: b}, function(error, obj) {
    if (error) {
      console.log("Error saving new campground to database");
      request.flash('danger', 'Unable to create Campground');
      response.redirect('/campgrounds');
    } else {
      console.log('Saved ' + obj + ' to the database');
      request.flash('success', 'Successfully created Campground');
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
    if (error || campground === null) {
      request.flash('danger', 'Unable to show Campground');
      response.redirect('/campgrounds');
      console.log('Error finding by slug' + error);
      return
    } else {
      response.render('./campgrounds/show', { campground: campground });
    }
  });
});

// EDIT
router.get('/campgrounds/:id/edit', function(request, response) {
  var name = request.params.id;
  Campground.findOne({ slug: name}, function(error, campground) {
    if (error || campground === null) {
      console.log('Error finding by slug ' + error);
      request.flash('danger', 'Unable to edit Campground');
      response.redirect('/campgrounds');
    } else {
      response.render('./campgrounds/edit', { campground: campground });
    }
  });
});

// UPDATE
router.put('/campgrounds/:id', loggedIn,  function(request, response) {
  var name = request.params.id;
  Campground.findOneAndUpdate({ slug: name }, request.body.campground, { new: true }, function (error, campground) {
    if (error) {
      console.log('Erroring Updating campground. Redirecting... : ' + error);
      request.flash('danger', 'Unable to update Campground');
      response.redirect('/campgrounds/' + name + '/edit');
    } else {
      request.flash('success', 'Successfully updated Campground')
      response.redirect('/campground/' + name)
    }
  });
});

// DELETE
router.delete('/campgrounds/:id',loggedIn,  function(request, response) {
  var id = request.params.id;
  Campground.deleteOne({ _id: id }, function (error) {
    if (error) {
      request.flash('danger', 'Unable to delete Campground');
      console.log('Error deleting campground');
    } else {
      console.log('Successfully deleted Campground')
    }

    request.flash('success', 'Successfully deleted Campground');
    response.redirect('/campgrounds');
  });
});

function loggedIn(request, response, next) {
  if (request.isAuthenticated()) {
    return next()
  }

  request.flash('danger', 'Please login to continue');
  response.redirect('/login');
}

module.exports = router;
