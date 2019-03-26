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
var LocalStrategy    = require('passport-local');
var passportMongoose = require('passport-local-mongoose');
var session          = require("express-session");
var indexRoutes      = require('./routes/index');
var movieRoutes      = require('./routes/movies');
var campgroundRoutes = require('./routes/campgrounds');
var commentsRoutes   = require('./routes/comments');
var authenticationRoutes = require('./routes/authentication');
var flash            = require('connect-flash');
var app = express();

mongoose.connect('mongodb://localhost/yelpcamp', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection to database error:'));
db.once('open', function() {
  console.log('connection to database successful');
});

/* Populate Database */
populateDatabase();

/* Using Flash Messages */
app.use(flash());

/* Allow PUT, DELETE form requests to route correctly */
app.use(methodOverride('_method'))

/* Parsing BODY on POST requests */
app.use(parser.urlencoded({ extended: true }));

/* HTTP Logging to STDOUT */
//app.use(morgan('combined'));

/* For Authentication */
app.use(session({ secret: "Deadpool", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

/* Read session and encode/decode. Uses mongoose-local encode/decode functions */
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

/* Middleware for getting currentUser for each routes */
app.use(function(request, response, next) {
  /* locals makes it available to templates */
  console.log('Do we have a user? ' + request.user);
  response.locals.currentUser = request.user;
  response.locals.success_messages = request.flash('success');
  response.locals.error_messages = request.flash('danger');
  console.log('Any success flashes?');
  console.log(request.flash('success'));
  console.log('Any danger flashes?');
  console.log(request.flash('danger'));
  next();
});

/* Route Files */
app.use(indexRoutes);
app.use(movieRoutes);
app.use(authenticationRoutes);
app.use(campgroundRoutes);
app.use(commentsRoutes);

/* Check on environment variables */
console.log(process.env.MOVIE_ID_KEY);

/* Set Templating engine */
app.set('view engine', 'ejs');

app.get('/', function(request, response){
  response.render('home');
});

app.get('*', function(request, response) {
    response.render('sorry');
});

app.listen(3001, function() {
  console.log('Server listening on 3001');
});
