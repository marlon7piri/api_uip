import { Router } from "express";
import { TorneoController } from "../../controllers/torneo.controller";

const router = Router();

router.post("/",(req,res)=> TorneoController.crear(req,res));
router.get("/", (req,res)=>TorneoController.listar(req,res));
router.get("/:id",(req,res)=> TorneoController.obtenerPorId(req,res));
router.get("/:id/goleadores",(req,res)=> TorneoController.obtenerGoleadores(req,res));
router.post("/:id/equipos",(req,res)=> TorneoController.agregarEquipo(req,res));
router.get("/:id/equipos",(req,res)=> TorneoController.equipos(req,res));


export default router;
