# YelpCamp
A NodeJS application to mess around with

`mongod --dpath ~/Development/mongodb-database`
`mongo`
`use yelpcamp`
`db.campgrounds.find().pretty()`

# Sort Timestamp

ObjectID stores the timestamp within the first 4 bytes. So to sort by createdAt

`query.sort({"_id" : -1})`

`db.campgrounds.deleteMany({ image: { $regex: /pixabay/}})`
