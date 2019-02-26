require('dotenv').config();
var express          = require('express')
var slug             = require('mongoose-slug-generator');
var mongoose         = require('mongoose')
var morgan           = require('morgan');
var parser           = require('body-parser');
var request          = require('request');
var faker            = require('faker');
var methodOverride   = require('method-override');
var Comment          = require('./models/comment');
var Campground       = require('./models/campground');
var User             = require('./models/user');
var populateDatabase = require('./database/seeds');
var passport         = require('passport');
var passportLocal    = require('passport-local');
var passportMongoose = require('passport-local-mongoose');
var session          = require("express-session");
var app = express();

mongoose.connect('mongodb://localhost/yelpcamp', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to database error:'));
db.once('open', function() {
  console.log('connection to database successful');
});

/* Populate Database */
populateDatabase();

/* Allow PUT, DELETE form requests to route correctly */
app.use(methodOverride('_method'))

/* Parsing BODY on POST requests */
app.use(parser.urlencoded({ extended: true }));

/* HTTP Logging to STDOUT */
app.use(morgan('combined'));

/* For Authentication */
app.use(session({ secret: "Deadpool", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

/* Read session and encode/decode. Uses mongoose-local encode/decode functions */
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Check on environment variables */
console.log(process.env.MOVIE_ID_KEY);

/* Set Templating engine */
app.set('view engine', 'ejs');

app.get('/googles', function(req, res) {
  request('http://www.google.com', function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
    res.send(body);
  });
});

app.get('/sunset', function (req, res) {
  request('https://query.yahooapis.com/v1/public/yql?q=select%20astronomy.sunset%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22maui%2C%20hi%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', function (error, response, body) {
    var json = JSON.parse(body);
    var sunset = json.query.results.channel.astronomy.sunset
    console.log('Sunset time in Hawaii ' + sunset);
    console.log('Sunset time in Hawaii another way ' + json["query"]["results"]["channel"]["astronomy"]["sunset"]);
    res.json(json);
  });
});

app.get('/search', function(req, res) {
  res.render('search');
});

app.get('/movie', function(req, res){
  res.redirect('/movie/' + req.query.movie);
});

app.get('/movie/:name', function(req, res) {
  var movie = req.params.name
  var search = 'http://www.omdbapi.com/?apikey=' + process.env.MOVIE_ID_KEY +'&s=' + movie
  request(search, function (error, response, body) {
    var json = JSON.parse(body);
    console.log(json);

    // Sort descending by year
    var movies = json["Search"].sort(function(first, second) {
      var f = parseInt(first.Year);
      var s = parseInt(second.Year);
      if (f > s) {
        return -1;
      } else if (f < s) {
        return 1;
      }

      return 0;
    });

    res.render('movies', { movies: movies } );
  });
});

// Auth Routes
app.get('/register', function(request, response) {
  response.render('./register/auth-form', { action: '/register', buttonText: 'Register' });
});

app.post('/register', function(request, response) {
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

app.get('/login', function(request, response) {
  response.render('./register/auth-form', { action: '/login', buttonText: 'Login' });
});

app.post('/login', function(request, response) {
  passport.authenticate('local')(request, response, function() {
    response.redirect('/campgrounds');
  });
});

// GET
app.get('/campgrounds', function(request, response) {
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
app.post('/campgrounds', function(request, response) {
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
app.get('/campgrounds/new', function(request, response) {
  response.render('./campgrounds/new');
});

// SHOW
app.get('/campground/:id', function(request, response){
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
app.get('/campgrounds/:id/edit', function(request, response) {
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
app.put('/campgrounds/:id', function(request, response) {
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
app.delete('/campgrounds/:id', function(request, response) {
  var name = request.params.id;
});

// NEW COMMENTS
app.get('/campgrounds/:id/comments/new', function(request, response) {
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
app.post('/campgrounds/:id/comments', function(request, response) {
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

app.get('/', function(request, response){
  response.render('home');
});

app.get('*', function(request, response) {
    response.render('sorry');
});

app.listen(3001, function() {
  console.log('Server listening on 3001');
});
