import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./controllers/Auth.js";
import { RecipeRouter } from "./controllers/Recipes.js";

const app = express();

app.use(cors({
    origin : ["https://recipe-view-backend.vercel.app"],
    methods : ["GET", "POST" ,"PUT"],
    credentials :true
}));
app.use(express.json());

const db = mongoose.connect("mongodb+srv://mukherjeed681:test@cluster0.2yulhdy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

if(db){
    console.log("db connected");
}

app.use("/auth",userRouter);
app.use("/recipe",RecipeRouter)

app.listen(3000,(req,res)=>{
    console.log("server connected ");
})
