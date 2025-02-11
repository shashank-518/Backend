import { Router} from "express";

import { healthCheckUp } from "../controllers/healthcheckup.controllers.js";

const router = Router()

router.route("/").get(healthCheckUp)

export default router