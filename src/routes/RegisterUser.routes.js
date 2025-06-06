import { Router } from "express";

import { RegisterUser , LogoutUser, LoginUser ,  } from "../controllers/RegisterUser.controllers.js";
import { uploads } from "../middleware/multer.middleware.js";

import { authmiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(uploads.fields([
    { name: "avatar", maxCount: 1 }, 
    {name:"coverImage", maxCount:1}
]), 
    RegisterUser);

router.route("/login").post(LoginUser)

router.route('/logout').post(authmiddleware , LogoutUser);

export default router;
