import { Router } from "express";
import { TorneoController } from "../../controllers/torneo.controllers";

const router = Router();

router.post("/", TorneoController.crear);
router.get("/", TorneoController.listar);
router.post("/:id/equipos", TorneoController.agregarEquipo);

export default router;
