import { Request, Response } from "express";
import { PartidoService } from "../services/partido.service";

export class PartidoController {
  static async crear(req: Request, res: Response) {
    const partido = await PartidoService.crearPartido({
      ...req.body,
      autorId: req.user.userid,
    });
    res.status(201).json(partido);
  }

  static async listar(req: Request, res: Response) {
    const partidos = await PartidoService.listarPartidos(req.user.userid);
    res.json(partidos);
  }
  static async listarAmistosos(req: Request, res: Response) {
    const partidos = await PartidoService.listarPartidosAmistosos(req.user.userid);
    res.json(partidos);
  }

  static async obtener(req: Request, res: Response) {
    const partido = await PartidoService.obtenerPorId(req.params.id);
    if (!partido) return res.status(404).json({ message: "No encontrado" });
    res.json(partido);
  }

  static async evento(req: Request, res: Response) {
    const { jugadorId, equipo, tipo } = req.body;
    const partido = await PartidoService.registrarEvento(
      req.params.id,
      jugadorId,
      equipo,
      tipo
    );
    res.json(partido);
  }

  static async finalizar(req: Request, res: Response) {
    const partido = await PartidoService.finalizarPartido(req.params.id);
    res.json(partido);
  }
  
  
}
