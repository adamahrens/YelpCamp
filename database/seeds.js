var faker = require('faker');
var Comment = require('../models/comment');
var Campground =  require('../models/campground');

function populateDatabase() {
  Campground.deleteMany({}, function(error) {
    Comment.deleteMany({}, function(error) {
      console.log('Removed all comments and Campgrounds. Repopulating');

      // CREATE COMMENTS & CAMPGROUNDS
      var promise1 = Campground.create({ name: "River Bottom", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80", blurb: faker.lorem.paragraphs(3) });
      promise1.then(function(camp) {
        console.log('Saved campground1 to the database');

        Comment.create({ text: faker.lorem.sentences(2), author: faker.name.firstName() }, function(error, com) {
          if (error) {
            console.log("Error saving comment to campground1");
          } else {
            camp.comments.push(com);
            camp.save();
            console.log('Added a comment to campground1');
          }
        });
      });

      var promise2 = Campground.create({ name: "Granite Hill", image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80", blurb: faker.lorem.paragraphs(3) });
      promise2.then(function(camp) {
        console.log('Saved campground2 to the database');

        Comment.create({ text: faker.lorem.sentences(2), author: faker.name.firstName() }, function(error, com) {
          if (error) {
            console.log("Error saving comment to campground2");
          } else {
            camp.comments.push(com);
            camp.save();
            console.log('Added a comment to campground2');
          }
        });
      });

      var promise3 = Campground.create({ name: "Price Creek",  image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80", blurb: faker.lorem.paragraphs(3) });
      promise3.then(function(camp) {
        console.log('Saved campground3 to the database');

        Comment.create({ text: faker.lorem.sentences(2), author: faker.name.firstName() }, function(error, com) {
          if (error) {
            console.log("Error saving comment to campground3");
          } else {
            camp.comments.push(com);
            camp.save();
            console.log('Added a comment to campground3');
          }
        });
      });

      var promise4 = Campground.create({ name: "Python Playground", image: "https://images.unsplash.com/photo-1480779735619-f73b30fdc062?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80", blurb: faker.lorem.paragraphs(3) });
      promise4.then(function(camp) {
        console.log('Saved campground4 to the database');

        Comment.create({ text: faker.lorem.sentences(2), author: faker.name.firstName() }, function(error, com) {
          if (error) {
            console.log("Error saving comment to campground4");
          } else {
            camp.comments.push(com);
            camp.save();
            console.log('Added a comment to campground4');
          }
        });
      });
    });
  });
}

module.exports = populateDatabase;
