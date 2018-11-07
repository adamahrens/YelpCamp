var express = require('express')
var morgan = require('morgan');
var parser = require('body-parser');
var app = express();

/* Parsing BODY on POST requests */
app.use(parser.urlencoded({ extended: true}));

/* HTTP Logging to STDOUT */
app.use(morgan('combined'));

/* Set Templating engine */
app.set('view engine', 'ejs');

app.get('*', function(request, response) {
    response.render('sorry');
})

app.listen(3001, function() {
  console.log('Server listening on 3001');
})
