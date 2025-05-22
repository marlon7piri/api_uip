import  express from  "express"

import  { crearJugador, obtenerJugadores,editarJugador, obtenerJugadorPorEquipo,obtenerJugadorPorId,obtenerJugadorPorUserId,deleteJugador } from  "../../controllers/jugadores.controllers"
import  { isAuth } from  "../../middleware/auth"

const router = express.Router();

router.post("/create", isAuth, crearJugador);
router.get("/list", isAuth, obtenerJugadores);
router.put("/edit/:id", isAuth, editarJugador);
router.delete("/delete/:id", isAuth, deleteJugador);
router.get("/listByEquipo/:id", isAuth, obtenerJugadorPorEquipo);
router.get("/getById/:id", isAuth, obtenerJugadorPorId);
router.get("/getByUserId/:id", isAuth, obtenerJugadorPorUserId);

export default router;
