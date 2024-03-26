import mongoose from "mongoose";

const Userschema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    savedRecipe :[{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "RecipeModel"
    }]
})

export const UserModel  = mongoose.model("User" ,Userschema);
