import { Router } from "express";

import { RegisterUser } from "../controllers/RegisterUser.controllers.js";
import { uploads } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(uploads.fields([
    { name: "avatar", maxCount: 1 }, 
    {name:"coverImage", maxCount:1}
]), 
    RegisterUser);

export default router;
