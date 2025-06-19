import { Request, Response } from "express";
import TorneoModels, { IOTorneo } from "../models/Torneo.models";
import Torneo from "../models/Torneo.models";
import EquipoModel from "../models/Equipo.models";
import ProximosPartidos from "../models/matcher.models";
import { IEquipo } from "entities/equipos";
import { ITorneo } from "entities/torneos";
import { verifyAutorId } from "utils/verifyautorId";
import User, { IUser } from "models/User.models";

// Crear un nuevo torneo
export const crearTorneo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { nombre, foto, autorId } = req.body;

    const userId = req.user?.userid;

    if (!userId) {
      res.status(500).json({ message: "No existe el token de acceso" });
    }
    const user: IUser = await User.findOne({ _id: userId });

    if (user && user.plan === "free") {
      return res
        .status(401)
        .json({ message: "Su plan no  le permite crear torneos" });
    }

    const nuevoTorneo = new Torneo({ autorId, nombre, foto });

    await nuevoTorneo.save();
    res.status(201).json(nuevoTorneo);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

// Obtener todos los torneos
export const obtenerTorneos = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const torneos = await Torneo.find();

    if (!torneos) {
      res.status(204).json({ message: "No hay torneos" });
    }

    res.status(200).json(torneos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

// Obtener un torneo por ID
export const obtenerTorneoPorId = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    type ITorneoPoblado = Omit<IOTorneo, "equipos"> & {
      equipos: IEquipo[];
    };

    const torneos: ITorneoPoblado | null = await Torneo.findById(req.params.id)
      .populate<{ equipos: IEquipo[] }>({
        path: "equipos",
        select: "nombre logo torneos estadisticasGlobales",
      })
      .populate("partidos")
      .populate("goleadores.jugador")
      .populate("asistentes.jugador")
      .populate("sancionados_roja.jugador")
      .populate("sancionados_amarilla.jugador");

    if (!torneos) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    const equiposConEstadisticas = torneos?.equipos?.map((equipo) => {
      const estadisticasDelTorneo = equipo?.torneos?.find(
        (torneo) => torneo.torneoId.toString() === req.params.id
      );
      const { estadisticasGlobales, nombre, logo } = equipo;

      return {
        _id: equipo._id,
        nombre: nombre,
        logo: logo,
        estadisticasGlobales: estadisticasGlobales,
        estadisticasTorneo: estadisticasDelTorneo || null, // Puede ser null si no tiene estadísticas
      };
    });
    const torneo_especifico = equiposConEstadisticas.filter(
      (equipo) => equipo.estadisticasTorneo !== null
    );

    // Ordena los equipos por puntos (suponiendo que la propiedad es 'puntos')
    torneo_especifico.sort((a, b) => {
      const difPuntos =
        b.estadisticasTorneo.estadisticas.puntos -
        a.estadisticasTorneo.estadisticas.puntos;

      if (difPuntos !== 0) {
        return difPuntos;
      }
      const difGolesA =
        a.estadisticasTorneo.estadisticas.goles_favor -
        a.estadisticasTorneo.estadisticas.goles_contra;
      const difGolesB =
        b.estadisticasTorneo.estadisticas.goles_favor -
        b.estadisticasTorneo.estadisticas.goles_contra;
      return difGolesB - difGolesA;
    });

    return res.status(200).json({ torneo_especifico, torneos });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

// Actualizar un torneo
export const actualizarTorneo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { nombre, foto } = req.body;
    const torneoActualizado = await Torneo.findByIdAndUpdate(
      req.params.id,
      { nombre, foto },
      { new: true } // Devuelve el documento actualizado
    );
    if (!torneoActualizado) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }
    res.status(200).json(torneoActualizado);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

// Eliminar un torneo
export const eliminarTorneo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const torneoEliminado = await Torneo.findByIdAndDelete(req.params.id);
    if (!torneoEliminado) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }
    res.status(200).json({ message: "Torneo eliminado correctamente" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

// Obtener un partido por ID
export const getPartidoByTorneo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const partido = await ProximosPartidos.find({ torneo_id: id })
      .populate("local", "nombre logo")
      .populate("visitante", "nombre logo")
      .populate("torneo_id", "nombre foto")
      .sort({ estado: -1 });

    if (!partido)
      return res.status(404).json({ message: "Partido no encontrado" });

    res.status(200).json(partido);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

export const getEquiposByTorneo = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const equipos = await TorneoModels.findById(id)
      .populate("equipos")
      .populate("partidos");

    if (!equipos)
      return res.status(404).json({ message: "Partido no encontrado" });

    res.status(200).json(equipos);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

// Obtener un partido por ID
export const registerEquiposByTorneo = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { idTorneo, equipos } = req.body;

  try {
    const isAutor = await verifyAutorId(Torneo, "");

    const torneo = await Torneo.findById(idTorneo);

    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    for (const teamId of equipos) {
      const equipoFound = await EquipoModel.findById(teamId);

      if (!equipoFound) {
        return res
          .status(404)
          .json({ message: `El equipo ${equipoFound.nombre} no se encuentra` });
      }

      const existTorneo = equipoFound.torneos.some(
        (torn) => torn.torneoId.toString() === idTorneo
      );

      if (existTorneo) {
        return res.status(400).json({
          message: `El equipo ${equipoFound.nombre} ya esta registrado en el torneo`,
        });
      }

      equipoFound.torneos.push({
        torneoId: torneo?._id,

        estadisticas: {
          goles_favor: 0,
          goles_contra: 0,
          partidos_empatados: 0,
          partidos_ganados: 0,
          partidos_jugados: 0,
          partidos_perdidos: 0,
          asistencias: 0,
          puntos: 0,
        },
      });

      await equipoFound.save();

      if (!torneo.equipos.includes(teamId)) {
        torneo.equipos.push(teamId);
      }
    }

    const torneosaved = await torneo.save();
    return res.status(200).json(torneosaved);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};
