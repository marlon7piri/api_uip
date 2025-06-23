import express from "express";

import {
  crearJugador,
  obtenerJugadores,
  editarJugador,
  obtenerJugadorPorEquipo,
  obtenerJugadorPorId,
  obtenerJugadorPorUserId,
  deleteJugador,
  actualizarJugador,
} from "../../controllers/jugadores.controllers";
import { isAuth } from "../../middleware/auth";
import { findPlanMiddleware } from "../../utils/findPlan";

const router = express.Router();

router.post("/create", isAuth, findPlanMiddleware, crearJugador);
router.get("/list", isAuth, obtenerJugadores);
router.put("/edit/:id", isAuth, editarJugador);
router.put("/editByUserId/:id", isAuth, actualizarJugador);
router.delete("/delete/:id", isAuth, findPlanMiddleware, deleteJugador);
router.get("/listByEquipo/:id", isAuth, obtenerJugadorPorEquipo);
router.get("/getById/:id", isAuth, obtenerJugadorPorId);
router.get("/getByUserId/:id", isAuth, obtenerJugadorPorUserId);
router.post("/createJugadorMasivo", isAuth, obtenerJugadorPorUserId);

export default router;
