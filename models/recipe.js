  var mongoose = require("mongoose");


 




  // SCHEMA SETUP
  var recipeSchema =  mongoose.Schema({
      image: {type: String, 
              unique: true
            },
      link: {type: String, 
              unique: true
            },
      title: {type: String, 
              unique: true
            },
      ingredientLines: Array,
      healthLabels: Array,
      dietLabels: Array,
      isSaved: {
        type: Boolean, 
        default: false

      }
      

  });

  module.exports = mongoose.model("recipe", recipeSchema);
