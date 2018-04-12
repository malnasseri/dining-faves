require('isomorphic-fetch');
// importing dot env
require('dotenv').config();
// setting variable for the applicaiton id and api key
const APP_ID = '3a8e3bc3';
const API_KEY = '5a5f81292c1d9cae1388b05d3b3d3e79';

function getRecipe(req, res, next) {
  // console.log('body', req.query.search)
  if(!req.query.search){
    res.locals.recipeHits = 'Sorry, nothing found';
    return next();
  }
  console.log('i am fetching')
  fetch(`https://api.edamam.com/search?q=${req.query.search}&app_id=${APP_ID}&app_key=${API_KEY}&from=0&to=9`)
    .then((fetchRes) => {
      return fetchRes.json();
    }).then((jsonFetchRes) => {
        // adding properties to res.locals
        res.locals.recipeHits = jsonFetchRes.hits;
        next();
    }).catch((err) => {
        console.log(err);
        // displaying an error message on the page if there is one
        res.locals.recipeHits = 'Sorry, nothing found';
        next();
    });
}

// exporting the function
module.exports = {
  getRecipe: getRecipe,
}