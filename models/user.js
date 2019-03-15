var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var passportMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String
});

userSchema.plugin(passportMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model("User", userSchema);
