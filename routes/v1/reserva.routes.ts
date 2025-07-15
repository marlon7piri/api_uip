import express from "express";
import {
  crearReserva,
  obtenerReservaByCanchaId,
  cancelarReserva,
  confirmarReserva,
} from "../../controllers/reservas.controllers";
import { isAuth } from "middleware/auth";

const router = express.Router();

router.get("/:id", isAuth, obtenerReservaByCanchaId);
router.patch("/cancelar/:id", isAuth, cancelarReserva);
router.patch("/confirmar/:id", isAuth, confirmarReserva);
router.post("/", isAuth, crearReserva);

export default router;
