import React, { useEffect, useState } from "react";
import axios from "axios";
import { getuserid } from "../hooks/useGetuserid";

const SavedRecipe = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userid = getuserid();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/recipe/savedRecipes/${userid}`
        );
        setSavedRecipes(response.data.savedRecipes || []);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSavedRecipes();
  }, [userid]);

  const handleDelete = async (recipeid) => {
    try {
      const response = await axios.delete("http://localhost:3000/recipe", { data: { recipeid } });
      if (response.status === 200) {
        setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeid));
        console.log("Recipe deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Saved Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedRecipes.map((recipe) => (
          <div key={recipe._id} className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>
            <p className="text-gray-700 mb-2">Cooking Time: {recipe.cookingTime}</p>
            <div>
              <p className="text-gray-700 mb-1 font-semibold">Ingredients:</p>
              <ul className="mb-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-gray-700 mb-1 font-semibold">Instruction:</p>
              <p className="text-gray-700 mb-2">{recipe.instructions}</p>
            </div>
            <button
              onClick={() => handleDelete(recipe._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg inline-block"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedRecipe;
