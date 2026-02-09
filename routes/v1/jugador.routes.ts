import { Router } from "express";
import { JugadorController } from "../../controllers/jugadores.controllers";

const router = Router();

router.post("/", JugadorController.crear);
router.get("/", JugadorController.listar);
router.get("/:id", JugadorController.obtenerPorId);
router.put("/:id", JugadorController.actualizar);
router.delete("/:id", JugadorController.eliminar);

export default router;
