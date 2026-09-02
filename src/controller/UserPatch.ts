import mongoose from "mongoose";
import User, { } from "../Model/usermodel";
import {Request,Response } from "express";
import bcrypt from "bcrypt"
//patch it update only user send where put replace all !
export const updateData= async (req:Request,res:Response):Promise<void>=>{
  try{
 const {userId,userName,userEmail} =req.body
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
   //validate the empty username in req body
   if(userName==""){
    res.status(400).json({
        data:"user not is empty "
    })
    return
   }
   ///name change here // undefine=not assign like  const userNme;/ logic: if username is not equal to empty then execeut ethe nisd e logic
   if (userName !==undefined){
    findUser.userName =userName;
   }
   /// the new email shoul dbe uniqe na so lets chke the email if its unique then the old email 
   if (userEmail!==undefined){
        if(userEmail===findUser.userEmail){
            res.status(400).json({
                succes:false,
                data:"the email should be new form the old one"
            })
        }
        const uniqueEmail= await User.findOne({
            userEmail:userEmail,
            _id:{$ne:userId}
        })
        // uniqueemail null ayerna bane execute hunxa like its also called falsy where only execute if any data come as objects 
        if(uniqueEmail!==null){
            res.status(400).json({
                succes:false,
                data:"email alread taken by someone"
            })
        }
    findUser.userEmail=userEmail;
    return;
   }
   await findUser.save();
   
   res.status(200).json({
    success:true,
    data:"the username and email has been change succesfully"
   })

  }catch(exp){
 console.error("internal server error", exp);
    res.status(500).json({
        success: false,
        data: "Internal server error"
    });
  }
}


//patch with old password and patch newpassword update
export const passwordPatch= async(req:Request,res:Response):Promise<void>=>{
    const {userId,oldPassword,newPassword}=req.body
    if(!mongoose.isValidObjectId(userId)){
        res.status(402).json({
            data:"this user is not valid user id "
        })
        return
    }
    const validateUser= await User.findById({_id:userId}).select("+userPassword")

    if(!validateUser){
        res.status(402).json({
            success:false,
            data:"ths user dindot exist "
        })
        return
    }
    const checkingOldPassword= await bcrypt.compare(oldPassword,validateUser.userPassword)

    if(!checkingOldPassword){
        res.status(402).json({
            success:false,
            data:"the user old password isnot correct"
        })
        return
    }
    const saltRound=12
    const newPassBcrypt= await bcrypt.hash(newPassword,saltRound)
    validateUser.userPassword=newPassBcrypt
    await validateUser.save()
    res.status(200).json({
        success:true,
        data:"the new password is succesfully update"
    })
}

export const putMethod= async(req:Request,res:Response):Promise<void>=>{
 try{

 }catch(exp){
    console.log("error while internal ",exp)
 }

 
}

