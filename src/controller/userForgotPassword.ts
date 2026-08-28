
import { Request, Response } from "express";
import User, { UserRole } from "../Model/usermodel";
import mongoose from "mongoose";
import crypto from "crypto"
import bcrypt from "bcrypt"
export async function forgotPassword(req:Request,res:Response) {
    try{
        const{userId,userEmail}=req.body
    
        if(!mongoose.isValidObjectId(userId)) return res.json({message:"this id isnot valid objects id"})
        
        const userExist= await User.findOne({userEmail:userEmail})
    
        if(!userExist) return res.json({message:"email not found"})
    
        const PasswordToken=crypto.randomBytes(32).toString("hex");
        console.log(PasswordToken)
        userExist.resetPasswordHash=PasswordToken
        userExist.resetPasswordTime=new Date(Date.now() + 15 * 60 * 1000)
        await userExist.save()
    
        res.json({message:"the reset link will provide "})
    }catch(error){
        res.json({data:"internal server error"})
    }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try{
         const{passwordToken,newPassword}=req.body
         const checkUser= await User.findOne({
            resetPasswordHash:passwordToken,
            resetPasswordTime:{$gt:Date.now()}
            })
        if(!checkUser){
            res.json({succes:false,message:`the user having =${passwordToken} isnot available or token expire`})
            return
        }
        const newPass= await bcrypt.hash(newPassword,10)
        checkUser.userPassword=newPass
        checkUser.resetPasswordHash=null;
        checkUser.resetPasswordTime=null;
        await checkUser.save();

        res.json({success:true,data:"successfully reset the password "})
    }catch(error){
        res.json({message:"error "})
         throw error
    }finally{
        res.json({message:"try again bro "})
    }
};