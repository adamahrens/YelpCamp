var mongoose = require('mongoose')
var slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

// Schema
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  blurb: String,
  slug: { type: String, slug: 'name' }
});

// Construct Model & Return
module.exports = mongoose.model('Campground', campgroundSchema);
