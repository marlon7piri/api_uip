import { Router } from "express";
import { PartidoController } from "../../controllers/partido.controller";

const router = Router();

router.post("/", PartidoController.crear);
router.get("/", PartidoController.listar);
router.get("/:id", PartidoController.obtener);

router.post("/:id/evento", PartidoController.evento);
router.post("/:id/finalizar", PartidoController.finalizar);

export default router;
