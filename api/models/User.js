import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";

const userSchema= new Schema({
    username:{type:String,required:true, unique:true},
    password:{type:String,required:true},
})

const userModel= model('User',userSchema);
export default userModel;