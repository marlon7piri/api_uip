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

  static async actualizar(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;
    const { club, edad, posicion, estatura } = req.body;

    // Solo extraemos los campos permitidos, ignoramos cualquier otra cosa
    const camposPermitidos: any = {};
    if (club !== undefined)    camposPermitidos.club = club;
    if (edad !== undefined)    camposPermitidos.edad = edad;
    if (estatura !== undefined) camposPermitidos.estatura = estatura;
    if (posicion !== undefined) {
      camposPermitidos["estadisticasGlobales.posicion"] = posicion;
    }

    if (Object.keys(camposPermitidos).length === 0) {
      return res.status(400).json({ message: "No se enviaron campos válidos" });
    }

    const jugador = await JugadorService.actualizarJugador(id, camposPermitidos);
    if (!jugador) return res.status(404).json({ message: "Jugador no encontrado" });

    return res.json(jugador);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

  static async eliminar(req: Request, res: Response) {
    await JugadorService.eliminarJugador(req.params.id);
    res.json({ message: "Jugador eliminado" });
  }

  

  
}
