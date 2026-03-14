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

    const partidoPoblado = await partido.populate("local visitante torneoId cancha eventos.jugador");

    // .to(id) envía el mensaje solo a los que están en esa sala
    io.to(req.params.id).emit("partido_actualizado", partidoPoblado);
    // 3. 🔥 ESTO ES LO QUE TE FALTA: Emitir a TODOS (para la lista general)
    io.emit('partido_actualizado', partidoPoblado);
    res.json(partido);
  }

  static async finalizar(req: Request, res: Response) {
    const partido = await PartidoService.finalizarPartido(req.params.id);
    res.json(partido);
  }


}
