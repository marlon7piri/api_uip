import  express  from "express"

import  { createOferta, getOfertas }  from "../../controllers/ofertas.controllers"
import  { isAuth }  from "../../middleware/auth"

const   router = express.Router();

router.post("/create", isAuth, createOferta);
router.get("/list", isAuth, getOfertas);

export default  router;
