import React, { useState } from "react";
import axios from "axios";
import { getuserid } from "../hooks/useGetuserid";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const CreatePost = () => {
  const userid = getuserid();
  const navigate = useNavigate();
  const [cookies] = useCookies(["access_token"]);

  const [recipeData, setRecipeData] = useState({
    name: "",
    ingredients: [],
    instructions: [],
    imageUrl: "",
    cookingTime: 0,
    userOwner: userid,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: value,
    });
  };

  const handleAddField = (field) => {
    setRecipeData({
      ...recipeData,
      [field]: [...recipeData[field], ""],
    });
  };

  const handleRemoveField = (field, index) => {
    const newFields = [...recipeData[field]];
    newFields.splice(index, 1);
    setRecipeData({
      ...recipeData,
      [field]: newFields,
    });
  };

  const handleInputChange = (index, field, value) => {
    const newFields = [...recipeData[field]];
    newFields[index] = value;
    setRecipeData({
      ...recipeData,
      [field]: newFields,
    });
  };

  const handleSubmit = async (e) => {
    console.log(cookies.access_token);
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/recipe",
        recipeData,
        {
          headers: {
            Authorization: `${cookies.access_token}`,
          },
        }
      );
      alert("Recipe created");
      console.log(response.data);
      console.log("Done");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Create Recipe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-semibold">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={recipeData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="bannerImg" className="block font-semibold">
              Banner Image URL:
            </label>
            <input
              type="text"
              id="bannerImg"
              name="imageUrl"
              value={recipeData.imageUrl}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="cookingTime" className="block font-semibold">
              Cooking Time (in minutes):
            </label>
            <input
              type="number"
              id="cookingTime"
              name="cookingTime"
              value={recipeData.cookingTime}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
            />
          </div>
          <div>
            <label className="block font-semibold">Ingredients:</label>
            {recipeData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) =>
                    handleInputChange(index, "ingredients", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField("ingredients", index)}
                  className="text-red-600 hover:text-red-800 focus:outline-none"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField("ingredients")}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none"
            >
              Add Ingredient
            </button>
          </div>
          <div>
            <label className="block font-semibold">Instructions:</label>
            {recipeData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) =>
                    handleInputChange(index, "instructions", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-4 py-2 w-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField("instructions", index)}
                  className="text-red-600 hover:text-red-800 focus:outline-none"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField("instructions")}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none"
            >
              Add Instruction
            </button>
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
