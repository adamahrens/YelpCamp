require('dotenv').config();
var express = require('express')
var slug = require('mongoose-slug-generator');
var mongoose = require('mongoose')
var morgan = require('morgan');
var parser = require('body-parser');
var request = require('request');
var faker = require('faker');
var app = express();
var Campground =  require('./models/campground');
mongoose.connect('mongodb://localhost/yelpcamp', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to database error:'));
db.once('open', function() {
  console.log('connection to database successful');
});

// Campground.deleteMany({}, function(error){
//   if (error) {
//     console.log('Error deleting all Campground records');
//   }
// });

Campground.countDocuments({}, function(error, count){
  if (error) {
    console.log("Error fetching count of Campgrounds");
  }

  if (count == 0) {
    console.log("Populating the database");
    Campground.create({ name: "River Bottom", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80", blurb: faker.lorem.sentence() }, function(error, obj) {
      if (error) {
        console.log("Error saving campground1 to database");
      } else {
        console.log('Saved ' + obj + ' to the database');
      }
    });

    Campground.create({ name: "Granite Hill", image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80", blurb: faker.lorem.sentence() }, function(error, obj) {
      if (error) {
        console.log("Error saving campground2 to database");
      } else {
        console.log('Saved ' + obj + ' to the database');
      }
    });

    Campground.create({ name: "Price Creek",  image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80", blurb: faker.lorem.sentence() }, function(error, obj) {
      if (error) {
        console.log("Error saving campground3 to database");
      } else {
        console.log('Saved ' + obj + ' to the database');
      }
    });
  } else {
    console.log("Number of campgrounds: " + count);
  }
});

/* Parsing BODY on POST requests */
app.use(parser.urlencoded({ extended: true}));

/* HTTP Logging to STDOUT */
app.use(morgan('combined'));

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

app.get('/campgrounds', function(request, response) {
  Campground.find({}, function(error, camps) {
    if (error) {
      console.log('Error fetching campgrounds ' + error);
    }

    var finalCamps = error ? [] : camps
    response.render('campgrounds', { campgrounds: finalCamps });
  })
  .sort({ '_id' : -1 });
});

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

app.get('/campgrounds/new', function(request, response) {
  response.render('new');
});

app.get('/campgrounds/:id', function(request, response){
  var name = request.params.id
  Campground.find({ slug: name}, function(error, campgrounds) {
    if (error || campgrounds.length == 0) {
      console.log('Error finding by slug' + error);
    } else {
      response.render('show', { campground: campgrounds[0]} );
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
