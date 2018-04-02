var mongoose = require("mongoose");
// var comment = require("./comment");

var CampgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price:String,
    description: String,
    author:{
      id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
      },
      username: String
    },
    comment:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }]
})

module.exports = mongoose.model("campground", CampgroundSchema);