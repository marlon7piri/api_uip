import { Request, Response } from "express";
import { JugadorService } from "../services/jugador.service";

export class JugadorController {
  static async crear(req: Request, res: Response) {
    const jugador = await JugadorService.crearJugador(req.body);
    res.status(201).json(jugador);
  }

  static async listar(req: Request, res: Response) {
    const jugadores = await JugadorService.listarJugadores(req.user.id);
    res.json(jugadores);
  }

  static async obtenerPorId(req: Request, res: Response) {
    const jugador = await JugadorService.obtenerJugadorPorId(req.params.id);
    if (!jugador) return res.status(404).json({ message: "Jugador no encontrado" });
    res.json(jugador);
  }

  static async actualizar(req: Request, res: Response) {
    const jugador = await JugadorService.actualizarJugador(
      req.params.id,
      req.body
    );
    res.json(jugador);
  }

  static async eliminar(req: Request, res: Response) {
    await JugadorService.eliminarJugador(req.params.id);
    res.json({ message: "Jugador eliminado" });
  }
}
