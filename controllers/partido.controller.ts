import { Request, Response } from "express";
import { PartidoService } from "../services/partido.service";
import { io } from "app";

export class PartidoController {
  static async crear(req: Request, res: Response) {
    const partido = await PartidoService.crearPartido({
      ...req.body,
      autorId: req.user.userid,
    });
    // Poblamos los datos necesarios para que el FlatList lo muestre bien de inmediato
    const partidoPoblado = await partido.populate("local visitante torneoId cancha");
    io.emit('partido_creado', partidoPoblado)
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
    const partidos = await PartidoService.listarPartidosAmistosos(req.user.userid);
    res.json(partidos);
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
    io.to(req.params.id).emit("partido_actualizado", partidoPoblado);
    // 3. 🔥 ESTO ES LO QUE TE FALTA: Emitir a TODOS (para la lista general)
    io.emit('partido_actualizado', partidoPoblado);
    res.json(partido);
  }

  static async finalizar(req: Request, res: Response) {
    const idPartido  = req.params.id;
    console.log({idPartidoAFinalizar:idPartido})

    const partido = await PartidoService.finalizarPartido(idPartido);
    const partidoPoblado = await partido.populate("local visitante torneoId cancha eventos.jugador");

    // IMPORTANTE: Emitir por socket para que todos vean que terminó
    io.emit("partido_actualizado", partidoPoblado);
    res.json(partidoPoblado);
  }


}
