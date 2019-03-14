var express          = require('express')
var router           = express.Router();
var request          = require('request');

router.get('/search', function(req, res) {
  res.render('search');
});

router.get('/movie', function(req, res){
  res.redirect('/movie/' + req.query.movie);
});

router.get('/movie/:name', function(req, res) {
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

module.exports = router;
