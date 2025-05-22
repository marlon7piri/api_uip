import {Request,Response} from "express"
import mongoose from "mongoose";
import EquipoModels from "../models/Equipo.models";
import ProximosPartidos from "../models/matcher.models";
import TorneoModels from "../models/Torneo.models";
import {
  goleadoresTorneo,
  asistentesTorneo,
  amarillasTorneo,
  rojasTorneo,
} from "../utils/actualizacionStaticsTorneo.js";
import { ITorneo } from "entities/torneos";

// Crear un nuevo partido
export const createPartido = async (req: Request, res: Response): Promise<any> => {
  try {
    const partido = new ProximosPartidos(req.body);
    const savedPartido = await partido.save();
    res.status(201).json(savedPartido);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Obtener todos los partidos
export const getAllPartidos = async (req: Request, res: Response): Promise<any> =>{
  try {
    const partidos = await ProximosPartidos.find()
      .populate("local", "nombre logo")
      .populate("visitante", "nombre logo")
      .populate("torneo_id", "nombre foto");

    res.status(200).json(partidos);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Obtener un partido por ID
export const getPartidoById = async (req: Request, res: Response): Promise<any> =>{
  try {
    const { id } = req.params;
    const partido = await ProximosPartidos.findById(id)
      .populate("local", "nombre logo")
      .populate("visitante", "nombre logo")
      .populate("torneo_id", "nombre foto")
      .populate("ganador", "nombre logo")
      .populate("perdedor", "nombre logo");

    if (!partido)
      return res.status(404).json({ message: "Partido no encontrado" });

    res.status(200).json(partido);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

/* estadisticasGlobales: {
    goles_favor: {
      type: Number,
      default: 0,
    },
    goles_contra: {
      type: Number,
      default: 0,
    },
    asistencias: {
      type: Number,
      default: 0,
    },

    partidos_jugados: {
      type: Number,
      default: 0,
    },
    partidos_ganados: {
      type: Number,
      default: 0,
    },
    partidos_perdidos: {
      type: Number,
      default: 0,
    },
    partidos_empatados: {
      type: Number,
      default: 0,
    }
  },
  torneos: [
    {
      torneoId: { type: mongoose.Schema.Types.ObjectId, ref: 'torneo' },
      estadisticas: {
        puntos: { type: Number, default: 0 },
        asistencias: { type: Number, default: 0 },
        goles_favor: { type: Number, default: 0 },
        goles_contra: {type: Number,default: 0},
        partidos_jugados: {type: Number,default: 0 },
        partidos_ganados: {type: Number, default: 0},
        partidos_perdidos: { type: Number,default: 0},
        partidos_empatados: {type: Number,default: 0 }
      }
    }
  ] */
export const evaluarPartidos = async (req: Request, res: Response): Promise<any> => {
  const {
    id_local,
    id_visitante,
    goles_local,
    goles_visitante,
    asistencias_local,
    asistencias_visitantes,
    tarjetas_amarillas,
    tarjetas_rojas,
    is_draw,
    torneoId,
    goleadores,
    asistentes,
    partidoId,
  } = req.body;

  try {

    // Validar que los IDs sean válidos
    if (
      (goleadores && !Array.isArray(goleadores)) ||
      (asistentes && !Array.isArray(asistentes)) ||
      goleadores.some((id:string) => !mongoose.isValidObjectId(id)) ||
      asistentes.some((id:string) => !mongoose.isValidObjectId(id))
    ) {
      return res
        .status(400)
        .json({ message: "IDs de goleadores o asistentes no son válidos" });
    }

    
    //Buscar ambos equipos
    const equipo_local = await EquipoModels.findById(id_local).populate(
      "torneos"
    );
    const equipo_visitante = await EquipoModels.findById(id_visitante).populate(
      "torneos"
    );
    const torneo  = await TorneoModels.findById(torneoId).populate("goleadores");

    const partido = await ProximosPartidos.findById(partidoId)
      .populate("resultado.goleadores")
      .populate("resultado.asistentes");

    if (!partido) {
      return res.status(400).json({ message: "partido no encontrado" });
    }

    if (partido.estado == "finalizado") {
      return res.status(400).json({ message: "El partido ya se evaluo" });
    }

    

    partido.resultado.golesLocal = goles_local;
    partido.resultado.golesVisitante = goles_visitante;
    partido.resultado.asistenciasLocal = asistencias_local;
    partido.resultado.asistenciasVisitante = asistencias_visitantes;

    // Agregar goleadores y asistentes sin sobrescribir los existentes
    partido.resultado.goleadores.push(
      ...goleadores.map((id:string) => new mongoose.Types.ObjectId(id))
    );
    partido.resultado.asistentes.push(
      ...asistentes.map((id:string) => new mongoose.Types.ObjectId(id))
    );

    partido.estado = "finalizado";

    await partido.save();

    await goleadoresTorneo(torneo, goleadores);
    await asistentesTorneo(torneo, asistentes);

    await amarillasTorneo(torneo, tarjetas_amarillas);
    await rojasTorneo(torneo, tarjetas_rojas);

    if (!equipo_local || !equipo_visitante) {
      return res.status(404).json({
        message: "Algunos de los equipos no se encontraron",
      });
    }

    const equipo_localfound = equipo_local.torneos.find(
      (torneo) => torneo.torneoId.toString() === torneoId
    );
    const equipo_visitantefound = equipo_visitante.torneos.find(
      (torneo) => torneo.torneoId.toString() === torneoId
    );

    if (!equipo_localfound) {
      return res.status(404).json({
        message: "Torneo no encontrado en equipo local",
      });
    }

    if (!equipo_visitantefound) {
      return res.status(404).json({
        message: "Torneo no encontrado en equipo visitante",
      });
    }

    //Hubo un empate

    if (partido.tipo === "clasificacion") {
      
      if (is_draw === "true") {
       
        //estadisticas globales
        equipo_local.estadisticasGlobales.partidos_empatados += 1;
        equipo_visitante.estadisticasGlobales.partidos_empatados += 1;
        equipo_local.estadisticasGlobales.partidos_jugados += 1;
        equipo_visitante.estadisticasGlobales.partidos_jugados += 1;

        //estadisticas del torneo
        equipo_localfound.estadisticas.partidos_empatados += 1;
        equipo_localfound.estadisticas.partidos_jugados += 1;
        equipo_localfound.estadisticas.puntos += 1;
        equipo_localfound.estadisticas.asistencias += asistencias_local;
        equipo_localfound.estadisticas.goles_favor += goles_local;
        equipo_localfound.estadisticas.goles_contra += goles_visitante;

        equipo_visitantefound.estadisticas.partidos_empatados += 1;
        equipo_visitantefound.estadisticas.partidos_jugados += 1;
        equipo_visitantefound.estadisticas.puntos += 1;
        equipo_visitantefound.estadisticas.asistencias +=
          asistencias_visitantes;
        equipo_visitantefound.estadisticas.goles_favor += goles_visitante;
        equipo_visitantefound.estadisticas.goles_contra += goles_local;
      }

      if (goles_local > goles_visitante) {
        //estadisticas globales
        equipo_local.estadisticasGlobales.partidos_ganados += 1;
        equipo_local.estadisticasGlobales.partidos_jugados += 1;
        equipo_local.estadisticasGlobales.goles_favor += goles_local;
        equipo_local.estadisticasGlobales.goles_contra += goles_visitante;

        equipo_visitante.estadisticasGlobales.partidos_perdidos += 1;
        equipo_visitante.estadisticasGlobales.partidos_jugados += 1;
        equipo_visitante.estadisticasGlobales.goles_favor += goles_visitante;
        equipo_visitante.estadisticasGlobales.goles_contra += goles_local;

        //Gano el equipo local
        equipo_localfound.estadisticas.partidos_jugados += 1;
        equipo_localfound.estadisticas.partidos_ganados += 1;

        equipo_localfound.estadisticas.puntos += 3;
        equipo_localfound.estadisticas.asistencias += asistencias_local;
        equipo_localfound.estadisticas.goles_favor += goles_local;
        equipo_localfound.estadisticas.goles_contra += goles_visitante;

        equipo_visitantefound.estadisticas.partidos_perdidos += 1;
        equipo_visitantefound.estadisticas.partidos_jugados += 1;
        equipo_visitantefound.estadisticas.goles_favor += goles_visitante;
        equipo_visitantefound.estadisticas.goles_contra += goles_local;
        equipo_visitantefound.estadisticas.asistencias +=
          asistencias_visitantes;
      } else if (goles_local < goles_visitante) {
        //Gano el equipo visitante

        //estadisticas globales
        equipo_local.estadisticasGlobales.partidos_jugados += 1;
        equipo_local.estadisticasGlobales.goles_contra += goles_visitante;
        equipo_local.estadisticasGlobales.goles_favor += goles_local;
        equipo_local.estadisticasGlobales.partidos_perdidos += 1;

        equipo_visitante.estadisticasGlobales.partidos_ganados += 1;
        equipo_visitante.estadisticasGlobales.partidos_jugados += 1;
        equipo_visitante.estadisticasGlobales.goles_favor += goles_visitante;
        equipo_visitante.estadisticasGlobales.goles_contra += goles_local;

        equipo_visitantefound.estadisticas.partidos_jugados += 1;
        equipo_visitantefound.estadisticas.partidos_ganados += 1;
        equipo_visitantefound.estadisticas.puntos += 3;
        equipo_visitantefound.estadisticas.asistencias +=
          asistencias_visitantes;
        equipo_visitantefound.estadisticas.goles_favor += goles_visitante;
        equipo_visitantefound.estadisticas.goles_contra += goles_local;

        equipo_localfound.estadisticas.partidos_perdidos += 1;
        equipo_localfound.estadisticas.partidos_jugados += 1;
        equipo_localfound.estadisticas.goles_favor += goles_local;
        equipo_localfound.estadisticas.goles_contra += goles_visitante;
        equipo_localfound.estadisticas.asistencias += asistencias_local;
      }
    } else {

      //Estadisticas si no es un partido de clasificacion, no sumara puntos

      if (is_draw === "true") {
        equipo_local.estadisticasGlobales.partidos_jugados += 1;
        equipo_local.estadisticasGlobales.goles_favor += goles_local;
        equipo_local.estadisticasGlobales.goles_contra += goles_visitante;

        equipo_visitante.estadisticasGlobales.partidos_jugados += 1;
        equipo_visitante.estadisticasGlobales.goles_favor += goles_visitante;
        equipo_visitante.estadisticasGlobales.goles_contra += goles_local;
      }

      //Gano local
      if (goles_local > goles_visitante) {
        equipo_local.estadisticasGlobales.partidos_ganados += 1;
        equipo_local.estadisticasGlobales.partidos_jugados += 1;
        equipo_local.estadisticasGlobales.goles_favor += goles_local;
        equipo_local.estadisticasGlobales.goles_contra += goles_visitante;

        equipo_visitante.estadisticasGlobales.partidos_perdidos += 1;
        equipo_visitante.estadisticasGlobales.partidos_jugados += 1;
        equipo_visitante.estadisticasGlobales.goles_favor += goles_visitante;
        equipo_visitante.estadisticasGlobales.goles_contra += goles_local;
      } else if (goles_local < goles_visitante) {

        //Gano visitante
        equipo_local.estadisticasGlobales.partidos_jugados += 1;
        equipo_local.estadisticasGlobales.goles_contra += goles_visitante;
        equipo_local.estadisticasGlobales.goles_favor += goles_local;
        equipo_local.estadisticasGlobales.partidos_perdidos += 1;

        equipo_visitante.estadisticasGlobales.partidos_ganados += 1;
        equipo_visitante.estadisticasGlobales.partidos_jugados += 1;
        equipo_visitante.estadisticasGlobales.goles_favor += goles_visitante;
        equipo_visitante.estadisticasGlobales.goles_contra += goles_local;
      }
    }

    await equipo_local.save();
    await equipo_visitante.save();

    //guardar las estadisticas del equipo local
    return res.status(201).json({
      message: "Estadísticas actualizadas",
      equipo_local,
      equipo_visitante,
    });
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};
