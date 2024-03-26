import express from 'express';
import { UserModel } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const secret = "mysecret";
const verifytoken =(req,res,next)=>{
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token,secret,(err)=>{
            if(err) return res.sendStatus(403);
            next()
        })
    }
    else{
        res.sendStatus(401)
    }
  }
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await UserModel.findOne({ username: username });

        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({
            id: user._id
        }, secret);

        res.json({ token, userid: user._id }); 
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    catch(err){
        console.log(err);
    }
});

export { router as userRouter , verifytoken };

