import { Router} from "express";

import { RegisterUser } from "../controllers/RegisterUser.controllers.js";

const router = Router()

router.route("/Register").get(RegisterUser)

export default router