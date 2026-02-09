import Jugador, { IJugador } from "../models/Jugador.models";
import mongoose from "mongoose";

export class JugadorService {
  static async crearJugador(data: Partial<IJugador>) {
    return Jugador.create(data);
  }

  static async listarJugadores(autorId: string) {
    return Jugador.find({ autorId }).populate("club");
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
