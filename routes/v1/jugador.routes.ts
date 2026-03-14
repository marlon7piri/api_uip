import { Router } from "express";
import { JugadorController } from "../../controllers/jugadores.controller";

const router = Router();

// jugador.routes.ts
router.post("/", (req, res) => JugadorController.crear(req, res));
router.get("/", (req, res) => JugadorController.listar(req, res));
router.get("/:id", (req, res) => JugadorController.obtenerPorId(req, res));
router.put("/:id", (req, res) => JugadorController.actualizar(req, res));
router.delete("/:id", (req, res) => JugadorController.eliminar(req, res));

export default router;
