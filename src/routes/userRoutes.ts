import { Router } from "express";
import { registerUser,loginUser, getUser,logout } from "../controller/UserAuth";

const router = Router();

router.post("/register", registerUser);
router.post("/login",loginUser);

router.get("/getuser",getUser);
router.post("/logout",logout)

export default router;

