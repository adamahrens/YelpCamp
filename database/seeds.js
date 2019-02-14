var faker = require('faker');
var Comment = require('../models/comment');
var Campground =  require('../models/campground');

function populateDatabase() {
  Campground.deleteMany({}, function(error) {
    Comment.deleteMany({}, function(error) {
      console.log('Removed all comments and Campgrounds. Repopulating');

      // CREATE COMMENTS & CAMPGROUNDS
      Campground.create({ name: "River Bottom", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80", blurb: faker.lorem.paragraphs(3) }, function(error, obj) {
        if (error) {
          console.log("Error saving campground1 to database");
        } else {
          console.log('Saved ' + obj + ' to the database');
        }
      }).then(function(camp){
        Comment.create({ text: faker.lorem.sentences(2) }, function(error, com) {
          if (error) {
            console.log("Error saving comment to campground1");
          } else {
            console.log('Saved' + com + ' to the database');
            camp.comments.push(com);
            camp.save();
          }
        });

        Comment.create({ text: faker.lorem.sentences(2) }, function(error, com) {
          if (error) {
            console.log("Error saving comment to campground1");
          } else {
            console.log('Saved' + com + ' to the database');
            camp.comments.push(com);
            camp.save();
          }
        });
      });

      Campground.create({ name: "Granite Hill", image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80", blurb: faker.lorem.paragraphs(3) }, function(error, obj) {
        if (error) {
          console.log("Error saving campground2 to database");
        } else {
          console.log('Saved ' + obj + ' to the database');
        }
      });

      Campground.create({ name: "Price Creek",  image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80", blurb: faker.lorem.paragraphs(3) }, function(error, obj) {
        if (error) {
          console.log("Error saving campground3 to database");
        } else {
          console.log('Saved ' + obj + ' to the database');
        }
      });

      Campground.create({ name: "Python Playground", image: "https://images.unsplash.com/photo-1480779735619-f73b30fdc062?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80", blurb: faker.lorem.paragraphs(3) }, function(error, obj) {
        if (error) {
          console.log("Error saving campground4 to database");
        } else {
          console.log('Saved ' + obj + ' to the database');
        }
      });
    });
  });
}

module.exports = populateDatabase;
