import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserRole } from "../Model/usermodel";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;


    console.log(authHeader)

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return;
    }
    console.log(authHeader)
    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
      return;
    }

    const secret = process.env.ACCESS_SECRET || "access_secret";

    const decoded = jwt.verify(token, secret) as { userId?: string };

    if (!decoded.userId) {
      res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
      return;
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (user.role !== UserRole.ADMIN) {
      res.status(403).json({
        success: false,
        message: "Only admin can access this route",
      });
      return;
    }

    (req as Request & { user?: typeof user }).user = user;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Unauthorized or invalid token",
    });
  }
};


export const adminOnly= async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
  try {

    const dataToken = req.headers.authorization;
  
    if(!dataToken|| !dataToken.startsWith("Bearer ")){
      res.json({
        message:"the toekn should be string "
      })
      return
    }
    const finalToken=dataToken.split(" ")[1];
  
    if(!finalToken){
      res.json({message:"this toekn should be vaild "})
      return
    }
    const validToken= process.env.ACCESS_SECRET || "secret_token"
    const decodValidtoken=jwt.verify(finalToken,validToken) as {userId?:string};
    if(!decodValidtoken.userId){
      res.json({message:"the provie jwt token is not valid or expire "})
      return 
    }
    const user=await User.findById(decodValidtoken.userId);

    if(!user){
      res.json({message:"the user dosnot exist "})
      return 
    }
    if(user.role!==UserRole.USER){
      res.json({

        onmessage:"this isnot a user only amdin would be delelte"
      })
      return 

    }
    user.refreshToken=null;
      user.accessToken=null;
    next();
  }
  catch(err){
    console.log("error this",err)
  }
}
