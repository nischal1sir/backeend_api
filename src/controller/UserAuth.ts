import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { UserRole } from "../Model/usermodel";


export const  registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(1)
    const {
      userName,
      userEmail,
      userPassword,
      userContact,
      role,
    } = req.body;

    if (!userName || !userEmail || !userPassword || !userContact) {
      res.status(400).json({
        success: false,
        message: "Name, email, password and contact are required",
      });
      return;
    }

    const normalizedEmail = userEmail.toLowerCase().trim();

    const existingUser = await User.findOne({
      userEmail: normalizedEmail,
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    const selectedRole = role || UserRole.ADMIN;

    if (!Object.values(UserRole).includes(selectedRole)) {
      res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
      return;
    }

    const saltRounds = 12;

    const hashedPassword = await bcrypt.hash(
      userPassword,
      saltRounds
    );

    const user = await User.create({
      userName: userName.trim(),
      userEmail: normalizedEmail,
      userPassword: hashedPassword,
      userContact: userContact.trim(),
      role: selectedRole,
      approved: false,
    });
    
const userResponse  = user.toObject();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("Register User Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const loginUser =async(req:Request,res:Response):Promise<void> =>{

}
export const getUser =async(req:Request,res:Response):Promise<void> =>{
  try{
    const allUser=await User.find();
    res.status(200).json({
      success:true,
      message:"all data fecth",
      data:allUser

    })
    
  }catch(exp){
    console.log("Dinot fetch teh all user",exp)
    res.status(500).json({
      success:true,
      message:"all data fecth",
    })

  }
}

