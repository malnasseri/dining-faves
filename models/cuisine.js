  var mongoose = require("mongoose");


  // SCHEMA SETUP
  var cuisineSchema =  mongoose.Schema({
      name: String,
      image: String,
      description: String,
      restaurant: String,
      cost: Number,
      location: String,
      lat: Number,
      lng: Number,
      votes:
          {
              type:Number,
              default: 0,
              ref:"Vote",
              // voter: String
          }
      ,
      voters: { type: Array, default: [] },
      
      
      createdAt: { type: Date, default: Date.now },
      author: {
          id: {
              type: mongoose.Schema.Types.ObjectId,
              ref:"User"
          },
          username: String,
      },
      comments:[
          {
              type: mongoose.Schema.Types.ObjectId,
              ref:"Comment"
          }
      ],
      commentsCount:  {

      type: Number,
      default: 0
    },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }
      ]

  });

  module.exports = mongoose.model("cuisine", cuisineSchema);
