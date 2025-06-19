import  express  from "express"

import  { createPartido, evaluarPartidos, getAllPartidos }  from "../../controllers/matcher.controllers"
import  { isAuth }  from "../../middleware/auth"
import { findPlanMiddleware } from "utils/findPlan";

const router = express.Router();

router.post("/create", isAuth,findPlanMiddleware, createPartido);
router.get("/list", isAuth, getAllPartidos);
router.post("/evaluar", isAuth,findPlanMiddleware, evaluarPartidos);

export default router;
