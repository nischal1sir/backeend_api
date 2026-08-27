import { Router } from "express";
import { registerUser,loginUser,getUser,userGetByName,deleteUser ,logoutUser} from "../controller/UserAuth";

import {updateData} from "../controller/UserPatch"

const router = Router();

router.post("/register", registerUser);
router.post("/login",loginUser);

router.post("/logout", logoutUser);


router.get("/getuser",getUser);
router.get("/getbyname",userGetByName)
// delte
router.delete("/deleteById",deleteUser)

// patch nad put
router.patch("/patch",updateData)

export default router;

