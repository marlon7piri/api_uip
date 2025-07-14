import express from "express";
import {
  crearReserva,obtenerReservaByCanchaId
} from "../../controllers/reservas.controllers";
import { isAuth } from "middleware/auth";

const router = express.Router();

router.get("/:id", isAuth, obtenerReservaByCanchaId);
router.post("/", isAuth, crearReserva);


export default router;
