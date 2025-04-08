import  express from  "express"

import  { crearJugador, obtenerJugadores,editarJugador, obtenerJugadorPorEquipo,obtenerJugadorPorId,deleteJugador, actualizarJugador, obtenerJugadorPorUserId } from  "../../controllers/jugadores.controllers.js"
import  { isAuth } from  "../../middleware/auth.js"

const router = express.Router();

router.post("/create", isAuth, crearJugador);
router.get("/list", isAuth, obtenerJugadores);
router.put("/edit/:id", isAuth, editarJugador);
router.put("/editByUserId/:id", isAuth, actualizarJugador);
router.delete("/delete/:id", isAuth, deleteJugador);
router.get("/listByEquipo/:id", isAuth, obtenerJugadorPorEquipo);
router.get("/getById/:id", isAuth, obtenerJugadorPorId);
router.get("/getByUserId/:id", isAuth, obtenerJugadorPorUserId);

export default router;
