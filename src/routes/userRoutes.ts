import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUser,
  userGetByName,
  deleteUser,
  logoutUser,
  logoutEmail,
} from "../controller/UserAuth";

import { passwordPatch, updateData } from "../controller/UserPatch";
import { forgotPassword, resetPassword } from "../controller/userForgotPassword";
import { adminMiddleware } from "../Middleware/adminMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
//lout out by refresh token in body
router.post("/logout", logoutUser);
//louout by email into body which make refreshtoken as null
router.post("/logoutEmail", logoutEmail);

router.get("/getuser", adminMiddleware, getUser);
router.get("/getbyname", userGetByName);
// delte
router.delete("/deleteById", deleteUser);

// patch nad put
router.patch("/patch", updateData);
// patch old password wiht new
router.patch("/patchPassword", passwordPatch);

//
router.post("/forgotPassword", forgotPassword);
router.post("/resetpassword", resetPassword);

export default router;

