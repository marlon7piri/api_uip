import { Request, Response } from "express";
import { EquipoService } from "../services/equipo.service";

export class EquipoController {
  static async crear(req: Request, res: Response) {
    try {
      console.log({ req})
      const equipo = await EquipoService.crearEquipo({
        ...req.body,
        autorId: req.user.userid,
      });
      

      res.status(201).json(equipo);
    } catch (error) {
      res.status(500).json({ message: "Error al crear equipo" });
    }
  }

  static async listar(req: Request, res: Response) {
    const equipos = await EquipoService.obtenerEquipos();
    res.json(equipos);
  }

  static async obtenerPorId(req: Request, res: Response) {
    const equipo = await EquipoService.obtenerEquipoPorId(req.params.id);
    if (!equipo) return res.status(404).json({ message: "Equipo no encontrado" });
    res.json(equipo);
  }

  static async actualizar(req: Request, res: Response) {
    const equipo = await EquipoService.actualizarEquipo(
      req.params.id,
      req.body
    );
    res.json(equipo);
  }

  static async eliminar(req: Request, res: Response) {
    await EquipoService.eliminarEquipo(req.params.id);
    res.json({ message: "Equipo eliminado" });
  }
}
