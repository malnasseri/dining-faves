  
  var mongoose = require("mongoose");

  var voteSchema = mongoose.Schema({
      text:  Number,
      				
      		
      
      author: {
          id: {
              type: mongoose.Schema.Types.ObjectId,
              ref:"User"
          },
          username: String
      }
  });


  module.exports = mongoose.model("Vote", voteSchema);



















// votes: {type: Number, default: 0},