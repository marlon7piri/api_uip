import  express from  "express"

import  { crearJugador, obtenerJugadores, obtenerJugadorPorEquipo } from  "../../controllers/jugadores.controllers.js"
import  { isAuth } from  "../../middleware/auth.js"

const router = express.Router();

router.post("/create", isAuth, crearJugador);
router.get("/list", isAuth, obtenerJugadores);
router.get("/listByEquipo/:id", isAuth, obtenerJugadorPorEquipo);

export default router;
