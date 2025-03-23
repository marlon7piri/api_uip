import  express  from "express"

import { crearEquipo, obtenerEquipoPorId, obtenerEquipoPorPartido, obtenerEquipos,actualizarEquipo }  from "../../controllers/equipo.controllers.js"
import  { isAuth }  from "../../middleware/auth.js"

const router = express.Router();

router.post("/create", isAuth, crearEquipo);
router.get("/list", isAuth, obtenerEquipos);
router.get("/:id", isAuth, obtenerEquipoPorId);
router.put("/:id", isAuth, actualizarEquipo);
router.post("/equiposPorPartidos", isAuth, obtenerEquipoPorPartido);

export default router;
