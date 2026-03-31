import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
  name:String,
  email:String,
  password:String
})
export const userModel=mongoose.model("users",userSchema )

const todoSchema=new mongoose.Schema({
  name:String,
  status:String
 
})
export const todoModel=mongoose.model("todo",todoSchema)