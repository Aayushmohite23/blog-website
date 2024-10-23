import express from "express";
import dotenv from 'dotenv';
import cors from 'cors'
import mongoose from "mongoose"
import userModel from "./models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

//Load environment variables
dotenv.config();
//Access JWT_SECRET from environment variables
const JWT_SECRET= process.env.JWT_SECRET;

const app= express();
app.use(cors({credentials: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

//encryption salt for bycrypt
const salt = bcrypt.genSaltSync(10);

mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("connected to mongoDB!");
        app.listen(4000,()=>{
            console.log("Server is running at port 4000");
        })
    })
    .catch(()=>{
        console.log("Connection failed");
    });

app.post('/register', async (req,res)=>{
    try {
        const {username,password}= req.body;
        const newUser= await userModel.create({
            username,
            password: bcrypt.hashSync(password,salt)
        });
        res.status(200).json(newUser); 
    } catch (error) {
        res.status(500).json({message: error.message})
    }  
});

app.post('/login',async (req,res) => {
   try {
        const{username,password}= req.body;
        const userDoc= await userModel.findOne({username:username});
        const passCheck=  bcrypt.compareSync(password, userDoc.password);
        
        if(passCheck){
            jwt.sign(
                {
                    id: userDoc._id,
                    username: userDoc.username
                },
                JWT_SECRET,
                {expiresIn: '1h'},
                (err,token)=>{
                    if(err) throw err;
                    else res.cookie('token',token).json({
                        id: userDoc._id,
                        username: userDoc.username,
                    });
                }
            );
            
        }
        else{
            res.status(401).json('Wrong credentials');
        }
        
   } catch (error) {
        res.status(500).json({message:error.message});
   } 
});

app.get('/profile',(req,res)=>{
    const token = req.cookies.token;
    jwt.verify(token,JWT_SECRET,{},(err,info)=>{
        if(err) throw err;
        else res.json(info);
    });
    
});

app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})

