var mongoose = require('mongoose')
var slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

// Schema
var campgroundSchema = new Schema({
  name: String,
  image: String,
  blurb: String,
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  slug: { type: String, slug: 'name' }
});

// Construct Model & Return
module.exports = mongoose.model('Campground', campgroundSchema);
