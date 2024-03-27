import React, { useEffect, useState } from "react";
import axios from "axios";
import { getuserid } from "../hooks/useGetuserid";
import { useCookies } from "react-cookie";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setsavedRecipes] = useState([]);
  const [userName, setUserName] = useState('');
  const [cookies] = useCookies(["access_token"]);
  const userid = getuserid();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3000/recipe");
        setRecipes(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchsavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://recipe-view-pi.vercel.app/recipe/savedRecipes/ids/${userid}`
        );
        setsavedRecipes(response.data.savedRecipe || []);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchUserName = async () => {
      try {
        const response = await axios.get(
          `https://recipe-view-pi.vercel.app/recipe/username/${userid}`
        );
        setUserName(response.data.username || '');
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecipe();
    fetchsavedRecipes();
    fetchUserName()
  }, []);

  const saveRecipe = async (recipeid) => {
    try {
      const response = await axios.put(
        "https://recipe-view-pi.vercel.app/recipe",
        {
          recipeid,
          userid,
        },
        {
          headers: { Authorization: cookies.access_token },
        }
      );
      setsavedRecipes([...savedRecipes, recipeid]);
      console.log(cookies.access_token);
    } catch (error) {
      console.log(error);
    }
  };

  const isLoggedIn = !!cookies.access_token;

  const issavedRecipe = (id) => savedRecipes.includes(id);

  return (
    <div className="container mx-auto">
     
      <h2 className="text-2xl font-bold mb-6 mt-6">Hello {userName}, what do you want to cook?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="p-4 bg-gray-100 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>
            <div className="text-gray-700 mb-2">
              Cooking Time: {recipe.cookingTime} minutes
            </div>
            <div className="mb-2">
              <p className="text-gray-700 mb-1">Ingredients:</p>
              <ul className="list-disc list-inside">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-2">
              <p className="text-gray-700 mb-1">Instructions:</p>
              <ul className="list-disc list-inside">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
            <div>
              {isLoggedIn && !issavedRecipe(recipe._id) && (
                <button
                  onClick={() => saveRecipe(recipe._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
              )}
              {isLoggedIn && issavedRecipe(recipe._id) && (
                <span className="text-green-500">Saved</span>
              )}
              {!isLoggedIn && (
                <span className="text-red-500">Login to save</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;