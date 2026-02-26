import Torneo from "../models/Torneo.models";
import Equipo from "../models/Equipo.models";
import { EquipoTorneoDTO } from "dtos/equipo.dto";
import { GrupoDTO } from "dtos/grupo.dto";
import { TorneoResponseDTO } from "dtos/torneo.dto";
import { ordenarTabla } from "utils/ordenarTabla.helper";

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
    return Torneo.find()
      .populate("equipos")
      .lean();
  }
  /* =========================
       EQUIPOS POR TORNEO
    ========================= */
  static async obtenerEquipos(torneoId: string) {
    const equipos = await Equipo.find({
      "torneos.torneoId": torneoId,
    })
      .select("nombre logo torneos")
      .lean();


    return equipos.map(e => {
      const participacion = e.torneos.find(

        (t: any) => t.torneoId.toString() === torneoId
      );
      return {
        _id: e._id,
        nombre: e.nombre,
        logo: e.logo,
        grupo: participacion?.grupo ?? null,
        estadisticas: participacion?.estadisticas,
      };
    });
  }

  /* =========================
     OBTENER TORNEO COMPLETO
  ========================= */
  static async obtenerTorneoCompleto(
    torneoId: string
  ): Promise<TorneoResponseDTO> {

    const torneo = await Torneo.findById(torneoId).lean();
    if (!torneo) throw new Error("Torneo no encontrado");

    /* =========================
       EQUIPOS DEL TORNEO
    ========================= */
    const equipos = await Equipo.find({
      "torneos.torneoId": torneoId,
    }).lean();

    /* =========================
       NORMALIZAR EQUIPOS
    ========================= */
    const equiposNormalizados: EquipoTorneoDTO[] = equipos.map(e => {
      const participacion = e.torneos.find(
        (t: any) => t.torneoId.toString() === torneoId
      );

      const stats = participacion?.estadisticas;

      return {
        _id: e._id.toString(),
        nombre: e.nombre,
        estadisticasTorneo: {
          goles_favor: stats?.goles_favor ?? 0,
          goles_contra: stats?.goles_contra ?? 0,
          asistencias: stats?.asistencias ?? 0,
          partidos_jugados: stats?.partidos_jugados ?? 0,
          partidos_ganados: stats?.partidos_ganados ?? 0,
          partidos_empatados: stats?.partidos_empatados ?? 0,
          partidos_perdidos: stats?.partidos_perdidos ?? 0,
          puntos: stats?.puntos ?? 0,
          diferencia_goles:
            (stats?.goles_favor ?? 0) - (stats?.goles_contra ?? 0),
        },
      };
    });

    /* =========================
       GRUPOS (DTO)
    ========================= */
    let gruposResponse: GrupoDTO[] | undefined;

    if (torneo.formato === "grupos" && torneo.grupos) {
      gruposResponse = torneo.grupos.map(grupo => {
        const equiposGrupo = grupo.equipos
          .map(equipoId =>
            equiposNormalizados.find(
              e => e._id === equipoId.toString()
            )
          )
          .filter(Boolean) as EquipoTorneoDTO[];

        return {
          nombre: grupo.nombre,
          equipos: ordenarTabla(equiposGrupo),
        };
      });
    }

    /* =========================
       RESPONSE FINAL
    ========================= */
    return {
      ...torneo,
      _id: torneo._id.toString(),
      grupos: gruposResponse,
      equipos: equiposNormalizados,
    };
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
