import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  ADMIN = "Admin",
  USER = "User",
}

export interface IUser extends Document {
  userName: string;
  userEmail: string;
  userPassword: string;
  userContact: string;
  role: UserRole;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [2, "Username must be at least 2 characters"],
      maxlength: [50, "Username cannot exceed 50 characters"],
      lowercase:true,
    },

    userEmail: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [100, "Email cannot exceed 100 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    userPassword: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlength: [128, "Password cannot exceed 128 characters"],
      select: false,
    },

    userContact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [
        /^(?:\+977[- ]?)?(?:98|97)\d{8}$/,
        "Please provide a valid Nepal phone number",
      ],
    },

    role: {
      type: String,
      lowercase:true,
      enum: {
        values: Object.values(UserRole),
        message: "Invalid user role",
      },
      default: UserRole.USER,
    },

    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
    versionKey: false,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;