import  express  from "express"

import  { crearTorneo, getPartidoByTorneo, obtenerTorneoPorId, obtenerTorneos, registerEquiposByTorneo }  from "../../controllers/torneos.controllers"
import  { isAuth }  from "../../middleware/auth"

const router = express.Router();

router.post("/create", isAuth, crearTorneo);
router.get("/list", isAuth, obtenerTorneos);
router.post("/registrarEquipos", isAuth, registerEquiposByTorneo);
router.get("/partidosbytorneo/:id", isAuth, getPartidoByTorneo);
router.get("/:id", isAuth, obtenerTorneoPorId);


export default router;
