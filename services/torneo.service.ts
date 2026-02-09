import Torneo from "../models/Torneo.models";
import Equipo from "../models/Equipo.models";

export class TorneoService {

  /* =========================
     CREAR TORNEO
  ========================= */
  static async crearTorneo(data: any) {
    if (data.formato === "grupos") {
      const grupos = Array.from(
        { length: data.cantidadGrupos },
        (_, i) => ({
          nombre: String.fromCharCode(65 + i), // A, B, C...
          equipos: [],
        })
      );

      data.grupos = grupos;
    }

    return Torneo.create(data);
  }

  /* =========================
     LISTAR TORNEOS
  ========================= */
  static async listar(autorId: string) {
    return Torneo.find({ autorId })
      .populate("equipos")
      .lean();
  }

  /* =========================
     CREAR GRUPOS (POSTERIOR)
  ========================= */
  static async crearGrupos(
    torneoId: string,
    cantidadGrupos: number
  ) {
    const torneo = await Torneo.findById(torneoId);
    if (!torneo) throw new Error("Torneo no encontrado");

    if (torneo.formato !== "grupos") {
      throw new Error("El torneo no es por grupos");
    }

    const grupos = Array.from(
      { length: cantidadGrupos },
      (_, i) => ({
        nombre: String.fromCharCode(65 + i),
        equipos: [],
      })
    );

    torneo.grupos = grupos;
    await torneo.save();

    return torneo;
  }

  /* =========================
     AGREGAR EQUIPO
  ========================= */
  static async agregarEquipo(
    torneoId: string,
    equipoId: string,
    grupoNombre?: string
  ) {
    const torneo = await Torneo.findById(torneoId);
    if (!torneo) throw new Error("Torneo no encontrado");

    // evitar duplicados
    if (!torneo.equipos.some(e => e.equals(equipoId))) {
      torneo.equipos.push(equipoId as any);
    }

    // grupos
    if (torneo.formato === "grupos") {
      if (!grupoNombre) {
        throw new Error("Debe indicar el grupo");
      }

      const grupo = torneo.grupos?.find(g => g.nombre === grupoNombre);
      if (!grupo) throw new Error("Grupo no encontrado");

      if (!grupo.equipos.some(e => e.equals(equipoId))) {
        grupo.equipos.push(equipoId as any);
      }
    }

    await torneo.save();

    // inicializar estadísticas del equipo en el torneo
    await Equipo.updateOne(
      { _id: equipoId, "torneos.torneoId": { $ne: torneo._id } },
      {
        $push: {
          torneos: {
            torneoId: torneo._id,
            estadisticas: {
              puntos: 0,
              goles_favor: 0,
              goles_contra: 0,
              asistencias: 0,
              partidos_jugados: 0,
              partidos_ganados: 0,
              partidos_perdidos: 0,
              partidos_empatados: 0,
            },
          },
        },
      }
    );

    return torneo;
  }
}
