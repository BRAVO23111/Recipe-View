import express from 'express';
import mongoose from 'mongoose';
import { RecipeModel } from '../models/Recipe.js';
import { UserModel } from '../models/User.js';
import { verifytoken } from './Auth.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.json(recipes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/',verifytoken, async (req, res) => {
  try {
    const userid = req.body.userOwner;
    const recipe = new RecipeModel({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: req.body.image,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      imageUrl: req.body.imageUrl,
      cookingTime: req.body.cookingTime,
      userOwner: userid,
    });
    const savedRecipe = await recipe.save();
    res.json(savedRecipe);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put("/", async (req, res) => {
  const recipe = await RecipeModel.findById(req.body.recipeid);
  const user = await UserModel.findById(req.body.userid);
  try {
    user.savedRecipe.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipe });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/savedRecipes/ids/:userId', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.json({ savedRecipe: user?.savedRecipe });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/savedRecipes/:userid', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userid);
    const savedRecipes = await RecipeModel.find({ _id: { $in: user.savedRecipe } });
    res.json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/username/:userId', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.username });
  } catch (error) {
    console.error('Error fetching username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.delete("/", async (req, res) => {
  try {
    const { recipeid } = req.body;

    // Find the user and update the savedRecipes array
    const user = await UserModel.findOneAndUpdate(
      { savedRecipe: recipeid }, 
      { $pull: { savedRecipe: recipeid } },
      { new: true, projection: { savedRecipe: 1, _id: 0 } } 
    );

    if (!user) {
      return res.status(404).json({ error: "User or recipe not found" });
    }

    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});








export { router as RecipeRouter };

