import { Router } from "express";
import  { createUserController } from "../../controllers/users/users.register.js";
import UserLogin from "../../controllers/users/user.login.js";

const router:Router =  Router();

router.post("/login",UserLogin)
router.post("/register",createUserController)

export  default router