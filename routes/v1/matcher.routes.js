import  express  from "express"

import  { createPartido, evaluarPartidos, getAllPartidos }  from "../../controllers/matcher.controllers.js"
import  { isAuth }  from "../../middleware/auth.js"

const router = express.Router();

router.post("/create", isAuth, createPartido);
router.get("/list", isAuth, getAllPartidos);
router.post("/evaluar", isAuth, evaluarPartidos);

export default router;
