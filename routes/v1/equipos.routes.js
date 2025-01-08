import  express  from "express"

import { crearEquipo, obtenerEquipoPorId, obtenerEquipoPorPartido, obtenerEquipos }  from "../../controllers/equipo.controllers.js"
import  { isAuth }  from "../../middleware/auth.js"

const router = express.Router();

router.post("/create", isAuth, crearEquipo);
router.get("/list", isAuth, obtenerEquipos);
router.get("/:id", isAuth, obtenerEquipoPorId);
router.post("/equiposPorPartidos", isAuth, obtenerEquipoPorPartido);

export default router;
