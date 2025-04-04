import  express  from "express"

import  { createPartido, evaluarPartidos, getAllPartidos }  from "../../controllers/matcher.controllers"
import  { isAuth }  from "../../middleware/auth"

const router = express.Router();

router.post("/create", isAuth, createPartido);
router.get("/list", isAuth, getAllPartidos);
router.post("/evaluar", isAuth, evaluarPartidos);

export default router;
