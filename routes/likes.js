  var express    = require("express");
  var router     = express.Router();
  var Cuisine = require("../models/cuisine");
  var Like    = require ("../models/like");
  var middleware = require("../middleware");

  // Comments New
 router.put("/cuisines/:id/likes/", middleware.isLoggedIn, function(req, res, next){

        // only once we have either tried and failed to process the geocode result, or succeeded and populated our newListings object, can we continue
        Cuisine.findByIdAndUpdate(req.params.id, { $inc: {likes: 1} }, function(err, cuisine){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              // req.flash("success","Successfully Updated!");
              res.redirect("/cuisines");
              console.log(cuisine);
          }
      });

});
  // middleware
 

  module.exports = router;
