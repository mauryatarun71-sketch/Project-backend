import express from 'express'
import jwt from 'jsonwebtoken'
import { resisterController,loginController,createTodoController
    ,getTodoController,deleteTodoController,updateTodoController,userController
 } from '../controller/resisterController.js';
const router=express.Router();
router.post("/resister",resisterController);
router.post("/login",loginController);
const AuthMiddleware=(req,res,next)=>{
    if(!req.headers.authorization){
         return({
                success:false,
                code:400,
                message:"token is required",
                data:"",
                error:true
         })
    }
    const rawToken=req?.headers?.authorization?.split(" ");
    const token=rawToken[1];
    jwt.verify(token,"jwt_secret",(err,decode)=>{
        if(err){
            return res.json({
                success:false,
                code:400,
                message:"invalid or expired token",
                data:"",
                error:true
            })
        }else{
            req.user=decode;
            next()
        }
    })
    
}
router.post("/create-todo",AuthMiddleware,createTodoController)
router.get("/get-todo",AuthMiddleware,getTodoController)
router.delete("/del-todo/:id",AuthMiddleware,deleteTodoController)
router.put("/update-todo/:id",AuthMiddleware,updateTodoController)
router.get('/userData',userController)

export default router;