import mongoose from "mongoose"

export const dbConnect=async()=>{
    const conn=await  mongoose.connect("mongodb://localhost:27017/user-data");
    if(conn){
        console.log("database is connected......")
    }
}