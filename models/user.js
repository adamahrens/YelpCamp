var mongoose = require("mongoose");
var passportMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String
});

userSchema.plugin(passportMongoose);

module.exports = mongoose.model("User", userSchema);
