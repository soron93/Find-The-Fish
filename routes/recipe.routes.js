const router = require("express").Router();
// let UserModel = require("../models/User.model");
// let FishModel = require("../models/Fish.model");
let RecipeModel = require("../models/Recipe.model");


// GET home page
router.get('/recipes', (req, res, next) => {

    RecipeModel.find()
      .then((recipe) => {
          res.render('recipe/recipe-list.hbs', {recipe})
      })
      .catch((err) => {
          next('Find failed')
      })
  });

// handling GET request to main/addrecipe
  router.get("/recipes", (req, res) => {
    res.render("recipe/addrecipe.hbs");
  });
  
  // handling POST request to main/addrecipe
  router.post("/recipes", (req, res, next) => {
    const {title, ingredients, instructions} = req.body
    const recipe = req.session.loggedInUser._id;
    RecipeModel.create({title, ingredients,instructions,recipe})
      .then(() => {
        res.render("recipe/recipe-list.hbs");
      })
      .catch(() => {
        next("failed to save recipe");
      });
  });


  router.get('/recipes/:id', (req,res,next) => {
    let dynamicRecipeId =req.params.id
  
    RecipeModel.findById(dynamicRecipeId)
    .then((recipe)=>{
      res.render('recipe/recipe-details.hbs', {recipe})
    })
    .catch(()=>{
      next('Finding details failed')
    })  
  })
  
  
  //Dynamic Update for form
router.get('/recipes/:id/edit', (req, res, next) => {

    let dynamicRecipeId = req.params.id


    RecipeModel.findById(dynamicRecipeId)
      .then ((recipe)=> {
        //pass the recipe value to the edit form
        res.render('recipe/update-recipe.hbs', {recipe})
      })
      .catch((err)=> {
        next('Cannot find the damn recipe details')
      })
  });
  

//Dynamic POST
  router.post('/recipes/:id/edit', (req, res, next) => {

    let dynamicRecipeId = req.params.id

     const {title, ingredients, instructions} = req.body
  
    RecipeModel.findByIdAndUpdate(dynamicRecipeId,{title, ingredients,instructions})
    .then (()=> {
    
      res.redirect('/recipe')
    })
    .catch ((err)=>{
      next('Edit failed')
    })
    
    
  });
  

  //Deletes POST
  router.post('/recipes/:id/delete', (req, res, next) => {

    //create variable for dynamic ID
    let dynamicRecipeId = req.params.id
  
    RecipeModel.findByIdAndDelete(dynamicRecipeId)
      .then(()=>{
        res.redirect('/recipe')
      })
      .catch(()=>{
        next('Failed to delete recipe')
      })
    
  });



  module.exports = router;