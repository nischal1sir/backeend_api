import { Router } from "express";
import { registerUser,loginUser, getUser } from "../controller/UserAuth";

const router = Router();

router.post("/register", registerUser);
router.post("/login",loginUser);

router.get("/getuser",getUser);
export default router;

