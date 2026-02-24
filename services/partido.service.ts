import ProximoPartido from "../models/partido.models";
import Equipo from "../models/Equipo.models";
import Jugador from "../models/Jugador.models";

type EventType = "gol" | "amarilla" | "roja";

export class PartidoService {
  /* =========================
     CRUD
  ========================= */

  static async crearPartido(data: any) {
    return ProximoPartido.create(data);
  }

  static async listarPartidos(autorId: string) {
    return ProximoPartido.find({ autorId })
      .populate("local visitante torneoId cancha");
  }

  static async listarPartidosAmistosos(autorId: string) {
    return ProximoPartido.find({tipo:'amistoso'})
      .populate("local visitante  cancha");
  }ß

  static async obtenerPorId(id: string) {
    return ProximoPartido.findById(id)
      .populate("local visitante torneoId cancha");
  }

  /* =========================
     EVENTOS
  ========================= */

  static async registrarEvento(
    partidoId: string,
    jugadorId: string,
    equipo: "local" | "visitante",
    tipo: EventType,
    minuto?: number
  ) {
    const partido = await ProximoPartido.findById(partidoId);
    if (!partido) throw new Error("Partido no encontrado");

    // Registrar evento (única fuente de verdad)
    partido.eventos.push({
      tipo,
      jugador: jugadorId as any,
      equipo: equipo === "local" ? partido.local : partido.visitante,
      minuto,
    });

    // Actualizar estadísticas del jugador
    if (tipo === "gol") {
      await Jugador.findByIdAndUpdate(jugadorId, {
        $inc: { "estadisticasGlobales.goles": 1 },
      });
    }

    if (tipo === "amarilla" || tipo === "roja") {
      const campo =
        tipo === "amarilla"
          ? "estadisticasGlobales.tarjetas_amarillas"
          : "estadisticasGlobales.tarjetas_rojas";

      await Jugador.findByIdAndUpdate(jugadorId, {
        $inc: { [campo]: 1 },
      });
    }

    return partido.save(); // middleware recalcula resultado
  }

  /* =========================
     FINALIZAR PARTIDO
  ========================= */

  static async finalizarPartido(partidoId: string) {
    const partido = await ProximoPartido.findById(partidoId);
    if (!partido) throw new Error("Partido no encontrado");

    if (partido.estado === "finalizado") {
      throw new Error("El partido ya está finalizado");
    }

    partido.estado = "finalizado";
    await partido.save();

    const { golesLocal, golesVisitante } = partido.resultado;

    // actualizar equipos
    await this.actualizarEquipo(
      partido.local,
      partido.torneoId,
      golesLocal,
      golesVisitante
    );

    await this.actualizarEquipo(
      partido.visitante,
      partido.torneoId,
      golesVisitante,
      golesLocal
    );

    return partido;
  }

  /* =========================
     HELPERS
  ========================= */

  private static async actualizarEquipo(
    equipoId: any,
    torneoId: any,
    golesFavor: number,
    golesContra: number
  ) {
    const inc: any = {
      "estadisticasGlobales.partidos_jugados": 1,
      "estadisticasGlobales.goles_favor": golesFavor,
      "estadisticasGlobales.goles_contra": golesContra,
    };

    if (golesFavor > golesContra) {
      inc["estadisticasGlobales.partidos_ganados"] = 1;
    } else if (golesFavor < golesContra) {
      inc["estadisticasGlobales.partidos_perdidos"] = 1;
    } else {
      inc["estadisticasGlobales.partidos_empatados"] = 1;
    }

    await Equipo.findByIdAndUpdate(equipoId, { $inc: inc });

    // estadísticas por torneo
    if (torneoId) {
      const puntos =
        golesFavor > golesContra ? 3 : golesFavor === golesContra ? 1 : 0;

      await Equipo.updateOne(
        { _id: equipoId, "torneos.torneoId": torneoId },
        {
          $inc: {
            "torneos.$.estadisticas.partidos_jugados": 1,
            "torneos.$.estadisticas.goles_favor": golesFavor,
            "torneos.$.estadisticas.goles_contra": golesContra,
            "torneos.$.estadisticas.puntos": puntos,
          },
        }
      );
    }
  }
}
