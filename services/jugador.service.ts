import Jugador, { IJugador } from "../models/Jugador.models";
import mongoose from "mongoose";

export class JugadorService {
  static async crearJugador(data: Partial<IJugador>) {
    return Jugador.create(data);
  }

  static async listarJugadoresPaginados(query: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const { page = 1, limit = 20, search = "" } = query;
    
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    let filter: any = {};

    // 🔥 Aplicamos la lógica de búsqueda por texto
    if (search) {
      filter.$text = { $search: search };
    }

    // Ejecutamos la consulta
    const jugadores = await Jugador.find(filter)
      .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate("club") // Poblamos el club para las cards
      .lean();

    const total = await Jugador.countDocuments(filter);

    return {
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      total,
      data: jugadores
    };
  }

  static async obtenerJugadorPorId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Jugador.findById(id).populate("club");
  }

  static async actualizarJugador(id: string, data: Partial<IJugador>) {
    return Jugador.findByIdAndUpdate(id, data, { new: true });
  }

  static async eliminarJugador(id: string) {
    return Jugador.findByIdAndDelete(id);
  }

  /* =========================
     ESTADÍSTICAS
  ========================= */

  static async sumarGol(jugadorId: string) {
    return Jugador.findByIdAndUpdate(
      jugadorId,
      { $inc: { "estadisticasGlobales.goles": 1 } },
      { new: true }
    );
  }

  static async sumarTarjeta(
    jugadorId: string,
    tipo: "amarilla" | "roja"
  ) {
    const campo =
      tipo === "amarilla"
        ? "estadisticasGlobales.tarjetas_amarillas"
        : "estadisticasGlobales.tarjetas_rojas";

    return Jugador.findByIdAndUpdate(
      jugadorId,
      { $inc: { [campo]: 1 } },
      { new: true }
    );
  }
}
