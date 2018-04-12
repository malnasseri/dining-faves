  var express  = require("express");
  var router   = express.Router();
  var passport = require ("passport");
  var User     = require ("../models/user");
  var Cuisine     = require ("../models/cuisine");
  var Recipe     = require ("../models/recipe");
  var recipeHelpers = require("../routes/recipeHelpers");




  // root route
  router.get("/", function (req, res){
      res.render("landing");
  });

  // SHOW REGISTER FORM
  router.get("/register", function(req, res){
      res.render("register", {page: "register"});
  });

  // Handle Sign Up Logic
  router.post("/register", function(req, res){
      var newUser = new User({
              username: req.body.username,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              avatar: req.body.avatar

          });
       if(req.body.adminCode === "1980"){
           newUser.isAdmin = true;
       }
      User.register(newUser, req.body.password,function(err, user){
          if(err){
              req.flash("error", err.message);
              return res.redirect("/login");
          }
          passport.authenticate("local")(req, res, function(){
              req.flash("success", "Welcome to DINING FAVES " + user.username);
              res.redirect("/cuisines");
          });
      });
  });
//    function delete1(){
//     Recipe.remove({isSaved: false}, function (err) {
//   if (err) return handleError(err);
//   // removed!
// });

//    }
   
  // SHOW LOGIN FORM
  router.get("/login", function(req, res){

      res.render("login", {page: "login"});
  });

// router.get("/recipes", recipeHelpers.getRecipe, function(req, res){


router.get('/search', recipeHelpers.getRecipe, (req, res) => {
    res.render('search', {
        documentTitle: 'Now We\'re Cookin\'',
        subTitle: 'Can\'t find what you\'re loking for? Try searching for it here!',
        message: 'Powered by',
        recipeHits: res.locals.recipeHits, 
    });
});












  //     // Get all cuisines from the DB
  //     Recipe.find({isSaved: false}, null,  function(err, allRecipes){
        
  //         if(err){
  //             console.log(err);
  //         } else {

  //              res.render("recipes", {recipes: allRecipes});
  //              console.log("+++++++++++++++++++++++++++++++  " + allRecipes);

  //         }
  //     });

  // });


// router.get('/search', recipeHelpers.getRecipe, (req, res) => {



//      Recipe.find({isSaved: false},  function(err, allRecipes){
        
//           if(err){
//               console.log(err);
//           } else {
//                res.render("recipes", {recipes: allRecipes, page: "recipes"});
//                console.log("+++++++++++++++++++++++++++++++  " + allRecipes);

//           }
//       });
//   });

// router.get("/search/recipes", function(req, res){
//       // Get all cuisines from the DB
    
//   });



// router.put("/recipes/:id", function(req, res) {
//   Recipe.findById(req.params.id, function(err, data) {
//     // if (data.issaved) {
//       Recipe.findByIdAndUpdate(req.params.id, {$set: {isSaved: true, status: "Save Article"}}, {new: true}, function(err, data) {
//         res.redirect("/recipes");
//       });
//     // }
//     // else {
//     //  Article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Saved"}}, {new: true}, function(err, data) {
//     //    res.redirect("/");
//     //  });
//     // }
//   });
// });





// LOGOUT ROUTES AND LOGIC
  router.get("/logout", function(req, res){
      req.logout();
      req.flash("success", "You have successfully logged out!");
      res.redirect("/cuisines");
  });
  // handling login logic
  router.post("/login", passport.authenticate("local",
       {
           successRedirect: "/cuisines", 
           failureRedirect: "/login"
  }), function(req, res){

  });


  module.exports = router;
