import Equipo from "../models/Equipo.models";
import Torneo from "../models/Torneo.models";

export class TablaService {

  /* =========================
     TABLA LIGA
  ========================= */
  static async obtenerTablaLiga(torneoId: string) {
    const equipos = await Equipo.find({
      "torneos.torneoId": torneoId,
    })
      .select("nombre logo torneos")
      .lean();

    return equipos
      .map(e => {
        const stats = e.torneos.find(
          (t: any) => t.torneoId.toString() === torneoId
        );

        if (!stats) return null;

        return {
          equipoId: e._id,
          equipo: e.nombre,
          logo: e.logo,
          ...stats.estadisticas,
          diferencia:
            stats.estadisticas.goles_favor -
            stats.estadisticas.goles_contra,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) =>
        b.puntos - a.puntos ||
        b.diferencia - a.diferencia ||
        b.goles_favor - a.goles_favor
      );
  }

  /* =========================
     TABLA POR GRUPO
  ========================= */
  static async obtenerTablaGrupo(
    torneoId: string,
    grupoNombre: string
  ) {
    const torneo = await Torneo.findById(torneoId).lean();
    if (!torneo) throw new Error("Torneo no encontrado");

    const grupo = torneo.grupos?.find(g => g.nombre === grupoNombre);
    if (!grupo) throw new Error("Grupo no encontrado");

    const equipos = await Equipo.find({
      _id: { $in: grupo.equipos },
      "torneos.torneoId": torneoId,
    })
      .select("nombre logo torneos")
      .lean();

    return equipos
      .map(e => {
        const stats = e.torneos.find(
          (t: any) => t.torneoId.toString() === torneoId
        );

        if (!stats) return null;

        return {
          equipoId: e._id,
          equipo: e.nombre,
          logo: e.logo,
          ...stats.estadisticas,
          diferencia:
            stats.estadisticas.goles_favor -
            stats.estadisticas.goles_contra,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) =>
        b.puntos - a.puntos ||
        b.diferencia - a.diferencia ||
        b.goles_favor - a.goles_favor
      );
  }
}
