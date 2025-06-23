import express from "express";

import {
  crearTorneo,
  getPartidoByTorneo,
  obtenerTorneoPorId,
  obtenerTorneos,
  registerEquiposByTorneo,
} from "../../controllers/torneos.controllers";
import { isAuth } from "../../middleware/auth";
import { findPlanMiddleware } from "../../utils/findPlan";

const router = express.Router();

router.post("/create", isAuth, findPlanMiddleware, crearTorneo);
router.get("/list", isAuth, obtenerTorneos);
router.post(
  "/registrarEquipos",
  isAuth,
  findPlanMiddleware,
  registerEquiposByTorneo
);
router.get("/partidosbytorneo/:id", isAuth, getPartidoByTorneo);
router.get("/:id", isAuth, obtenerTorneoPorId);

export default router;
