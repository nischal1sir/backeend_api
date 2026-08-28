import { Router } from "express";
import { registerUser,loginUser,getUser,userGetByName,deleteUser ,logoutUser, logoutEmail} from "../controller/UserAuth";

import {updateData} from "../controller/UserPatch"

const router = Router();

router.post("/register", registerUser);
router.post("/login",loginUser);
//lout out by refresh token in body
router.post("/logout", logoutUser);
//louout by email into body which make refreshtoken as null
router.post("/logoutEmail",logoutEmail)

router.get("/getuser",getUser);
router.get("/getbyname",userGetByName)
// delte
router.delete("/deleteById",deleteUser)

// patch nad put
router.patch("/patch",updateData)

export default router;

