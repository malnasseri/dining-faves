var express    = require("express");
  var router     = express.Router();
  var Cuisine = require("../models/cuisine");
    var Vote = require("../models/vote");
var request = require("request");
  var middleware = require("../middleware");
  var geocoder = require("geocoder");
  var multer = require('multer');

  var storage = multer.diskStorage({
    filename: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  });

 





  var imageFilter = function (req, file, cb) {
      // accept image files only
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
          return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
  };
  var upload = multer({ storage: storage, fileFilter: imageFilter})

  var cloudinary = require('cloudinary');

  cloudinary.config({
    cloud_name: 'mo1982',
    api_key: '134129763127846',
    api_secret: 'jupGqrD_jv9QZqGQxDcsjMSui-o',
  });

  // INDEX ROUTE -- SHOW ALL CUISINES
  router.get("/cuisines", function(req, res){
      // Get all cuisines from the DB
      Cuisine.find({}, null, {sort: '-votes'}, function(err, allCuisines){
        console.log(allCuisines);
          if(err){
              console.log(err);
          } else {
               res.render("cuisines/index", {cuisines: allCuisines, page: "cuisines"});

          }
      });
  });


  // CREATE -- ADD NEW CUISINE TO DB
  router.post("/cuisines",middleware.isLoggedIn, upload.single('image'), function(req,res){
    // get data from form and add to data array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var restaurant = req.body.restaurant;
    var author = {
      id: req.user._id,
      username: req.user.username
  }
    var cost = req.body.cost;
    console.log(req.user.username);
    //Location Code - Geocode Package


    var newCuisine = {name: name,  description: desc, cost: cost, author:author, restaurant:restaurant};


    geocoder.geocode(req.body.location, function (err, data) {
    //   if (err || data.status === 'ZERO_RESULTS') {
    //   req.flash('error', 'Invalid address');
    //   return res.redirect('back');
    //   console.log(data);
    // }
if (data && data.results && data.results.length) {
    newCuisine['lat'] = data.results[0].geometry.location.lat;
            newCuisine['lng'] = data.results[0].geometry.location.lng;
            newCuisine['location'] = data.results[0].formatted_address;
          }
      // var lat        = data.results[0].geometry.location.lat;
      // var lng        = data.results[0].geometry.location.lng;
      // var location   = data.results[0].formatted_address;
      

    cloudinary.uploader.upload(req.file.path, function(result) {
            // add cloudinary url for the image to the cuisine object under image property
            console.log(result);
            newCuisine.image = result.secure_url;

            Cuisine.create(newCuisine, function(err, cuisine) {
              if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
              }
              return res.redirect('/cuisines');
            });
        });
    });
});


  // NEW -- SHOW FORM TO CREATE NEW CUISINES
       router.get("/cuisines/new",middleware.isLoggedIn, function(req, res){
           res.render("cuisines/new");

  });

  // SHOW - show more info about one cuisine
  router.get("/cuisines/:id", function(req, res){
      // find the cuisine with provided ID
      Cuisine.findById(req.params.id).populate("comments").exec(function(err, foundCuisine){
          if(err || !foundCuisine){
              req.flash("error", "Cuisine not found");
              res.redirect("back");
          } else{
              // render show template with that cuisine
              res.render("cuisines/show", {cuisine: foundCuisine});
          }
      });

  });

  // EDIT CUISINE ROUTE
  router.get("/cuisines/:id/edit", middleware.checkCuisineOwnership, function(req, res){
      Cuisine.findById(req.params.id, function(err, foundCuisine){
          res.render("cuisines/edit", {cuisine: foundCuisine});
      });
  });



router.put("/cuisines/:id/votes/", middleware.isLoggedIn, function(req, res, next){

var voters = [];

var voter = {
      id: req.user._id,
      username: req.user.username
  }
       
          var newVote = { voter: voter }

Vote.findByIdAndUpdate(req.params.id, {$set: newVote}, function(err, vote){

          console.log("++++++++++++++++______________________" + newVote.voter.username)

          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              res.redirect("..");
          }
      });



Cuisine.findByIdAndUpdate(req.params.id, {$addToSet: {"voters": newVote.voter.username}}, {new : true}, function(err, cuisine){



Cuisine.findByIdAndUpdate(req.params.id, { $inc: {votes: 1} }, function(err, cuisine){})

    })
})

router.put("/cuisines/:id/unvotes/", middleware.isLoggedIn, function(req, res, next){

var voters = [];

var voter = {
      id: req.user._id,
      username: req.user.username
  }
       
          var newVote = { voter: voter }
Vote.findByIdAndUpdate(req.params.id, {$set: newVote}, function(err, vote){

          console.log("++++++++++++++++______________________" + newVote.voter.username)

          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              res.redirect("..");
          }
      });


Cuisine.findByIdAndUpdate(req.params.id, {$pull: {"voters": newVote.voter.username}}, {new : true}, function(err, cuisine){

 
Cuisine.findByIdAndUpdate(req.params.id, { $inc: {votes: -1} }, function(err, cuisine){})

    })
})


router.put("/cuisines/:id", function(req, res){

    // create a newListings object with the data available to us on post

    var newData = {
          name: req.body.cuisine.name,
          
          description: req.body.cuisine.description,
          cost: req.body.cuisine.cost,
          restaurant: req.body.cuisine.restaurant
          // votes: req.body.cuisine.votes
          // location: location
        }

    // initiate a call to geocode.  When the geocode is complete, add other fields to our newListings object
    geocoder.geocode(req.body.cuisine.location, function (err, data) {
        if (data && data.results && data.results.length) { // there are some results
            newData['lat'] = data.results[0].geometry.location.lat;
            newData['lng'] = data.results[0].geometry.location.lng;
            newData['location'] = data.results[0].formatted_address;
        }

        // only once we have either tried and failed to process the geocode result, or succeeded and populated our newListings object, can we continue
        Cuisine.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, cuisine){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              // req.flash("success","Successfully Updated!");
              res.redirect("/cuisines/" + req.params.id + "/edit");
          }
      });
    });
});



  // DESTROY CUISINE ROUTES
  router.delete("/cuisines/:id", middleware.checkCuisineOwnership, function(req, res){
      Cuisine.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/cuisines");
        } else {
            res.redirect("/cuisines");
        }
     });
  });

  // middleware
  function isLoggedIn(req,res,next){
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect("/login");
  }

  function checkCuisineOwnership(req, res, next){
      // is user logged in?
         if(req.isAuthenticated()){
             Cuisine.findById(req.params.id, function(err,foundCuisine){
                  if(err){
              res.redirect("/cuisines");
         } else{
               //   does the user own the cuisine?
              if(foundCuisine.author.id.equals(req.user._id)) {
                  next();
              } else{
                  res.redirect("back");
              }
            }
          });
           } else{
              res.redirect("back");
          }
  }

  module.exports = router;