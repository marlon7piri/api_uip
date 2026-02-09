import { Router } from "express";
import { EquipoController } from "../../controllers/equipo.controllers";

const router = Router();

router.post("/", EquipoController.crear);
router.get("/", EquipoController.listar);
router.get("/:id", EquipoController.obtenerPorId);
router.put("/:id", EquipoController.actualizar);
router.delete("/:id", EquipoController.eliminar);

export default router;
