import  express  from "express"

import  { createOferta, getOfertas }  from "../../controllers/ofertas.controllers.js"
import  { isAuth }  from "../../middleware/auth.js"

const   router = express.Router();

router.post("/create", isAuth, createOferta);
router.get("/list", isAuth, getOfertas);

export default  router;
