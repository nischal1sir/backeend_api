import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { UserRole } from "../Model/usermodel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log(1);
    const { userName, userEmail, userPassword, userContact, role } = req.body;

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

    const selectedRole = role || UserRole.USER;

    if (!Object.values(UserRole).includes(selectedRole)) {
      res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
      return;
    }

    const saltRounds = 12;

    const hashedPassword = await bcrypt.hash(userPassword, saltRounds);

    const user = await User.create({
      userName: userName.trim(),
      userEmail: normalizedEmail,
      userPassword: hashedPassword,
      userContact: userContact.trim(),
      role: selectedRole,
      approved: false,
    });

    const userResponse = user.toObject();

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


/// login routes
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const normalizedEmail = userEmail.toLowerCase().trim();

    const user = await User.findOne({ userEmail: normalizedEmail }).select(
      "+userPassword",
    );

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      userPassword,
      user.userPassword,
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }
    
    //create the refresh token
    ///save the refresh tooken
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET!,
    );

    user.refreshToken = refreshToken;

 const accessToken= jwt.sign(
  {userId:user._id},
  process.env.ACCESS_SECRET!,
  {expiresIn:"15m"}
 )
// asign the accessToken into accesstoken of user of accestoekn colums
    user.accessToken = accessToken;
    // to save
    await user.save();

    const userResponse = user.toObject();

    delete (userResponse as { userPassword?: string }).userPassword;

    const isAdmin = user.role === UserRole.ADMIN;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        ...userResponse,
        isAdmin,
      },
    });
  } catch (error) {
    console.error("Login User Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//to get all the user routes
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUser = await User.find();
    res.status(200).json({
      success: true,
      message: "all data fecth",
      data: allUser,
    });
  } catch (exp) {
    console.log("Dinot fetch teh all user", exp);
    res.status(401).json({
      success: false,
      message: "the server error",
    });
  }
};

/// fin by user name succes:fail to run as logic
export const userGetByName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userName } = req.body;
    
    //chek garne ya
    const checkinguser= userName.toLowerCase()
    const userExist = await User.findOne({userName:checkinguser});
    if (!userExist) {
      res.status(401).json({
        success: false,
        data: `the ${userName} didnot exist in our system`,
      });
      return
    }

    res.status(200).json({
      success: true,
      data: userExist,
    });
  } catch (exp) {
    console.log("the server got error", exp);
    res.status(500).json({
      success: false,
      data: "error while conneting the server",
    });
  }
};

//delete the user by id

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.body;
    if (!mongoose.isValidObjectId(userId)) {
      res.status(400).json({
        data: "this isnoo  valid ojects id",
      });
      return;
    }

    const userChecking = await User.findById({_id:userId});

    if (!userChecking) {
      res.status(400).json({
        data: `user not found `,
      });
      return;
    }
    if (userChecking?.role !== UserRole.ADMIN) {
      res.status(402).json({ data: "the user isnot admin" });
      return;
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      succes: true,
      data: "admin delte succesfully",
    });
  } catch (e) {
    console.log("Delete user error", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};

///lougout as refereshtoke set as null into user.referestoken colums
export const logoutUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
if(!refreshToken){
  res.status(400).json({
    data:"refreshtoken provide "
  })
  return
}
    const checkRefreshToken = await User.findOne({ refreshToken });
    if (!checkRefreshToken) {
      res.status(402).json({
        data: `invalid refresh token`,
      });
      return;
    }

    checkRefreshToken.refreshToken = null;

    await checkRefreshToken.save();
    res.status(200).json({
      succes: true,
      data: "succesfully logout",
    });
  } catch (exp) {
    console.log("error in serve", exp);
    res.status(400).json({
      success: false,
      data: "internal server eeror",
    });
  }
};


//logout conecpt with the email 
export const logoutEmail=async (req:Request,res:Response):Promise<void>=>{
   const {userEmail,userPassword}=req.body;
   if(!userEmail||!userPassword){
    res.status(400).json({
      data:"email or password reuqired"
    })
    return;
    
   }
   const caseEmail=userEmail.toLowerCase().trim()
   const checkUserExist= await User.findOne({userEmail:caseEmail}).select("+userPassword")
   if(!checkUserExist){
    res.status(400).json({
      succes:false,
      data:"the user email insot available"
    })
    return
   }
   const comparePassword= await bcrypt.compare(userPassword,checkUserExist.userPassword);
   if(!comparePassword){
    res.status(400).json({
      data:"the password dinot match"
    })
    return;
   }
  checkUserExist.accessToken=null;
  checkUserExist.refreshToken=null;
  await checkUserExist.save()

  res.status(200).json({
    data:`the user lougot succesfully of ${userEmail} `
  })


}

export const getUserByNameParam=async (req:Request,res:Response):Promise<void>=>{
 try{

   const {name}=req.query
 if(typeof name!=="string" || !name.trim()){
    res.json({success:false,message:"provide the valid queryname"})
    return
 }
   const user=await User.findOne({userName:name.trim()})
 
   if(!user){
  res.json({message:"the user namd dindot exist"})
   }
   res.json({succes:true,data:name})
 }catch(err){
console.log("error mesage")
 }


}