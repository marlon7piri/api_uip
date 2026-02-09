import { Request, Response } from "express";
import { TorneoService } from "../services/torneo.service";

export class TorneoController {
  static async crear(req: Request, res: Response) {
    const torneo = await TorneoService.crearTorneo({
      ...req.body,
      autorId: req.user.id,
    });
    res.status(201).json(torneo);
  }

  static async listar(req: Request, res: Response) {
    const torneos = await TorneoService.listar(req.user.id);
    res.json(torneos);
  }

  static async agregarEquipo(req: Request, res: Response) {
    const { equipoId, grupo } = req.body;
    await TorneoService.agregarEquipo(
      req.params.id,
      equipoId,
      grupo
    );
    res.json({ message: "Equipo agregado al torneo" });
  }

  static async tabla(req: Request, res: Response) {
    const tabla = await TorneoService.tablaPosiciones(req.params.id);
    res.json(tabla);
  }
}
