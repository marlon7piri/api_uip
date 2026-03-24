import { Router } from "express";
import { PartidoController } from "../../controllers/partido.controller";

const router = Router();

router.post("/", (req,res)=>PartidoController.crear(req,res));
router.get("/amistosos",(req,res)=> PartidoController.listarAmistosos(req,res));
router.get("/:id", (req,res)=>PartidoController.obtener(req,res));

// Listar partidos de un torneo
router.get("/torneo/:idTorneo", PartidoController.listar);

// Ruta para que los jugadores se unan al partido
router.post("/:idPartido/unir-jugador", PartidoController.unirJugador);

// Ruta para obtener solo los jugadores que están en el partido (para el selector de goles/rojas)
router.get("/:idPartido/jugadores-aptos", PartidoController.listarJugadoresParaEvento);

router.post("/:id/evento", PartidoController.evento);
router.put("/:id/eventos", PartidoController.actualizarEventos);
router.post("/:id/finalizar", PartidoController.finalizar);
router.get("/:id/jugadores-partido", PartidoController.jugadoresPorPartido);

export default router;
