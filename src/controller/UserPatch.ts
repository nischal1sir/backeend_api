import mongoose from "mongoose";
import User, { UserRole } from "../Model/usermodel";
import {Request,Response } from "express";
//patch
export const updateData= async (req:Request,res:Response):Promise<void>=>{
  try{
 const {userId,userName} =req.body
  if(!mongoose.isValidObjectId(userId)){
    res.status(401).json({
        success:false,
        data:`${userId} is not valid object ID`
    })
    return ;
  }
   const findUser= await User.findById(userId);

   if(!findUser){
    res.status(400).json({
        success:false,  
        data:"this user dinot exist"
    })
    return;
   }
   ///name change here
   if (userName !==undefined){
    findUser.userName =userName;
   }
   await findUser.save();
   res.status(200).json({
    success:true,
    data:"the username change succesfully"
   })

  }catch(exp){
    console.log("internal server errrr",exp)
  }
}