import express from "express";
import {
  crearCancha,
  obtenerCanchas,
  obtenerCanchaPorId,
  obtenerCanchaPorUserId,
  actualizarCancha,
  eliminarCancha,
  obtenerCanchasCercanas,
} from "../../controllers/cancha.controller";
import { isAuth } from "middleware/auth";

const router = express.Router();

router.get("/", isAuth, obtenerCanchas);
router.get("/cercanas", isAuth, obtenerCanchasCercanas);
router.get("/:id", isAuth, obtenerCanchaPorId);
router.get("/canchaByUserId/:id", isAuth, obtenerCanchaPorUserId);

router.post("/", isAuth, crearCancha);
router.put("/:id", isAuth, actualizarCancha);
router.delete("/:id", isAuth, eliminarCancha);

export default router;
