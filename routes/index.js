var express          = require('express')
var router           = express.Router();
var request          = require('request');

router.get('/googles', function(req, res) {
  request('http://www.google.com', function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    console.log('body:', body);
    res.send(body);
  });
});

module.exports = router;
