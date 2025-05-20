import express from "express";
import dotenv from 'dotenv';
import cors from 'cors'

import mongoose from "mongoose"
import userModel from "./models/User.js";
import postModel from "./models/Post.js" ;
import commentModel from "./models/Comment.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "file-system";


//Load environment variables
dotenv.config();
//Access JWT_SECRET from environment variables
const JWT_SECRET= process.env.JWT_SECRET;

const app= express();
app.use(cors({credentials: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

// uploads access to the client(images of blog)
import path from 'path'
import { fileURLToPath } from "url";
const __filename= fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename);
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));

//encryption salt for bycrypt
const salt = bcrypt.genSaltSync(10);

//File upload handler
const uploadMiddleware= multer({dest: 'uploads/'});
const port = process.env.PORT || 4000;
mongoose.connect(process.env.DB_URL)
    .then(()=>{
        console.log("connected to mongoDB!");
        app.listen(port,()=>{
            console.log("Server is running at port " + port);
        })
    })
    .catch(()=>{
        console.log("Db Connection failed");
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


app.post('/post',uploadMiddleware.single('file'),async (req,res)=>{
    const {originalname,path}= req.file;
    const parts= originalname.split('.');
    const extension= parts[parts.length-1];
    const newPath= path+'.'+extension;
    await fs.renameSync(path,newPath);
    
    const token = req.cookies.token;
    jwt.verify(token,JWT_SECRET,{},async (err,info)=>{
        if(err) throw err;
        
        const {title,summary,content}=req.body;
        const postDoc= await postModel.create({
            title: title,
            summary: summary,
            content: content,
            cover: newPath,
            author: info.id,
        })
        res.json(postDoc);
        
    });  
})

app.put('/post',uploadMiddleware.single('file'),async (req,res)=>{
    let newPath=null;
    if(req.file){
        const {originalname,path}= req.file;
        const parts= originalname.split('.');
        const extension= parts[parts.length-1];
        newPath= path+'.'+extension;
        await fs.renameSync(path,newPath);
    }
    const token = req.cookies.token;
    jwt.verify(token,JWT_SECRET,{},async (err,info)=>{
        if(err) throw err;
        
        const {id,title,summary,content}=req.body;
        const postDoc = await postModel.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            res.status(400).json('You are not the author!');
            throw 'You are not the author!';
        }
        postDoc.title = title;
        postDoc.summary = summary;
        postDoc.content = content;
        postDoc.cover = newPath ? newPath : postDoc.cover;
        await postDoc.save();
        res.json(postDoc);
    }); 
})

app.get('/post',async (req,res)=>{
    res.json(await postModel.find()
        .populate('author',['username'])
        .sort({createdAt:-1})
        .limit(15)
    );
})

app.get('/post/:id',async (req,res)=>{
    const {id}= req.params;
    const postDoc= await postModel.findById(id).populate('author',['username']);
    res.json(postDoc);
})

// Add comment route
app.post('/comment', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    jwt.verify(token, JWT_SECRET, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        try {
            const { content, postId } = req.body;
            const commentDoc = await commentModel.create({
                content,
                author: info.id,
                post: postId,
            });
            const populatedComment = await commentModel.findById(commentDoc._id).populate('author', ['username']);
            res.json(populatedComment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
});

// Get comments for a post
app.get('/comments/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await commentModel.find({ post: postId })
            .populate('author', ['username'])
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});