import { Router } from "express";
import { EquipoController } from "../../controllers/equipo.controller";

const router = Router();

router.post("/",(req,res)=> EquipoController.crear(req,res));
router.get("/",(req,res)=> EquipoController.listar(req,res));
router.get("/:id",(req,res)=> EquipoController.obtenerPorId(req,res));
router.put("/:id",(req,res)=> EquipoController.actualizar(req,res));
router.delete("/:id",(req,res)=> EquipoController.eliminar(req,res));

export default router;
