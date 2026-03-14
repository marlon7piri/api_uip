import { Request, Response } from "express";
import { JugadorService } from "../services/jugador.service";

export class JugadorController {
  static async crear(req: Request, res: Response) {
    const jugador = await JugadorService.crearJugador(req.body);
    res.status(201).json(jugador);
  }

  static async listar(req: Request, res: Response):Promise<any> {
    try {
      const { page, limit, search } = req.query;

      // Llamamos al service pasando los parámetros de búsqueda
      const resultado = await JugadorService.listarJugadoresPaginados({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string
      });

      return res.json(resultado);
    } catch (error) {
      return res.status(500).json({ 
        message: "Error obteniendo la lista de jugadores", 
        error 
      });
    }
  }

  static async obtenerPorId(req: Request, res: Response) :Promise<any>{
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
