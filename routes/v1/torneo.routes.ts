import { Router } from "express";
import { TorneoController } from "../../controllers/torneo.controller";

const router = Router();

router.post("/", TorneoController.crear);
router.get("/", TorneoController.listar);
router.get("/:id", TorneoController.obtenerPorId);
router.post("/:id/equipos", TorneoController.agregarEquipo);
router.get("/:id/equipos", TorneoController.equipos);


export default router;
