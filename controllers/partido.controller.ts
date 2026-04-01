import { Request, Response } from "express";
import { PartidoService } from "../services/partido.service";
//import { io } from "../app";
import Partido from "../models/partido.models";
import { TorneoService } from "../services/torneo.service";

export class PartidoController {
  static async crear(req: Request, res: Response) {
    const partido = await PartidoService.crearPartido({
      ...req.body,
      autorId: req.user.userid,
    });
    // Poblamos los datos necesarios para que el FlatList lo muestre bien de inmediato
    const partidoPoblado = await partido.populate("local visitante torneoId cancha");
    //io.emit('partido_creado', partidoPoblado)
    res.status(201).json(partidoPoblado);


  }

  static async listar(req: Request, res: Response) {
    try {
      const { idTorneo } = req.params;
      const partidos = await PartidoService.listarPorTorneo(idTorneo);
      res.json(partidos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async unirJugador(req: Request, res: Response) {
    try {
      const { idPartido } = req.params;
      const { idJugador } = req.body;
      const actualizado = await PartidoService.vincularJugador(idPartido, idJugador);
      res.json({ message: "Jugador unido al partido", partido: actualizado });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async listarJugadoresParaEvento(req: Request, res: Response) {
    try {
      const { idPartido } = req.params;
      const jugadores = await PartidoService.obtenerJugadoresAptos(idPartido);
      res.json(jugadores);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  static async listarAmistosos(req: Request, res: Response) {
    try {
      const partidos = await PartidoService.listarPartidosAmistosos(req.user.userid);
      res.json(partidos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }

  }

  static async obtener(req: Request, res: Response): Promise<any> {
    const partido = await PartidoService.obtenerPorId(req.params.id);
    if (!partido) return res.status(404).json({ message: "No encontrado" });
    res.json(partido);
  }

  static async evento(req: Request, res: Response) {
    const { jugadorId, equipo, tipo, minuto } = req.body;
    const partido = await PartidoService.registrarEvento(
      req.params.id,
      jugadorId,
      equipo,
      tipo,
      minuto
    );

    const partidoPoblado = await partido.populate("local visitante torneoId cancha eventos.jugador");

    // .to(id) envía el mensaje solo a los que están en esa sala
    //io.to(req.params.id).emit("partido_actualizado", partidoPoblado);
    // 3. 🔥 ESTO ES LO QUE TE FALTA: Emitir a TODOS (para la lista general)
    //io.emit('partido_actualizado', partidoPoblado);
    res.json(partido);
  }

  static async actualizarEventos(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { eventos } = req.body;

      const partido = await Partido.findById(id);
      if (!partido) return res.status(404).json({ message: "Partido no encontrado" });

      partido.eventos = eventos;
      await partido.save(); // El middleware recalcula el marcador (golesLocal/Visitante)

      // 🔥 SI EL PARTIDO ESTÁ FINALIZADO O ES DE TORNEO, RECALCULAMOS TABLA
      if (partido.torneoId) {
        await TorneoService.recalcularTabla(partido.torneoId.toString());
      }

      const partidoPoblado = await partido.populate("local visitante torneoId cancha eventos.jugador");
      //io.emit('partido_actualizado', partidoPoblado);
      //io.emit('tabla_actualizada', { torneoId: partido.torneoId }); // Avisar al front que la tabla cambió

      return res.json(partidoPoblado);
    } catch (error) {
      return res.status(500).json({ message: "Error al sincronizar" });
    }
  }
  static async finalizar(req: Request, res: Response) {
    const idPartido = req.params.id;

    const partido = await PartidoService.finalizarPartido(idPartido);
    const partidoPoblado = await partido.populate("local visitante torneoId cancha eventos.jugador");

    // IMPORTANTE: Emitir por socket para que todos vean que terminó
    //io.emit("partido_actualizado", partidoPoblado);
    res.json(partidoPoblado);
  }
  static async jugadoresPorPartido(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params; // partidoId
      const resultado = await PartidoService.obtenerJugadoresPorPartidoService(id);
      if (resultado) res.json(resultado);
      else {
        return res.status(404).json({ message: 'Partido no encontrado' });
      }

    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

}
