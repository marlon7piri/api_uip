import { Request, Response } from "express";
import { TorneoService } from "../services/torneo.service";

export class TorneoController {

  /* =========================
     CREAR TORNEO
  ========================= */
  static async crear(req: Request, res: Response) {
    const torneo = await TorneoService.crearTorneo({
      ...req.body,
      autorId: req.user.userid,
    });

    res.status(201).json(torneo);
  }

  /* =========================
     LISTAR TORNEOS
  ========================= */
  static async listar(req: Request, res: Response) {
    const torneos = await TorneoService.listar(req.user.userid);
    res.json(torneos);
  }

  /* =========================
     AGREGAR EQUIPO
     (liga o grupo)
  ========================= */
  static async agregarEquipo(req: Request, res: Response) {
    const { equipoId, grupo } = req.body;

    await TorneoService.agregarEquipo(
      req.params.id,
      equipoId,
      grupo // puede ser undefined si es liga
    );

    res.json({ message: "Equipo agregado al torneo" });
  }

  /* =========================
     CREAR GRUPOS
  ========================= */
  static async crearGrupos(req: Request, res: Response) {
    const { cantidadGrupos } = req.body;

    await TorneoService.crearGrupos(
      req.params.id,
      cantidadGrupos
    );

    res.json({ message: "Grupos creados correctamente" });
  }
}
