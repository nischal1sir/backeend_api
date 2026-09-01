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

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return;
    }

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