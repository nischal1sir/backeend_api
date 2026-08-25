import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User, { UserRole } from "../Model/usermodel";
import { promises } from "node:dns";

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
/// fin by user name
export const userGetByName = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userName } = req.body;
    //chek garne ya
    const userCheck = userName.toLowerCase().trim();
    const userExist = await User.findOne({ userNaame: userCheck });

    if (!userExist) {
      res.status(401).json({
        success: false,
        data: `the ${userName} didnot exist in our system`,
      });
    }
    if (userExist) {
      res.status(402).json({
        success: true,
        data: `the ${userName} data is here`,
      });
    }
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

    const userChecking = await User.findById({ users: userId });

    if (!userChecking) {
      res.status(400).json({
        data: `user not found `,
      });
    }
    if (userChecking?.role !== UserRole.ADMIN) {
      res.status(402).json({ data: "the user isnot admin" });
      return;
    }
    await User.findByIdAndDelete(userChecking);
  } catch (e) {
    console.log("Delete user error", e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    return;
  }
};
