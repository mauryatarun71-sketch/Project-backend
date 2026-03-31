import express from 'express'
import { dbConnect } from './dbconnect/db.js';
import router from './router/router.js';

import cors from 'cors'


const app=express();
const PORT=9000;
app.use(cors());


app.use(express.json())

dbConnect();
app.use("/api",router)

app.listen(PORT,()=>{
    console.log("server is running........")
})