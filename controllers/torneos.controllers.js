// controllers/torneoController.js
import TorneoModels from "../models/Torneo.models.js";
import Torneo from "../models/Torneo.models.js";
import EquipoModel from "../models/Equipo.models.js";
import ProximosPartidos from "../models/matcher.models.js";

// Crear un nuevo torneo
export const crearTorneo = async (req, res) => {
  try {
    const { nombre, foto } = req.body;
    const nuevoTorneo = new Torneo({ nombre, foto });
    await nuevoTorneo.save();
    res.status(201).json(nuevoTorneo);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el torneo", error });
  }
};

// Obtener todos los torneos
export const obtenerTorneos = async (req, res) => {
  try {
    const torneos = await Torneo.find();
    res.status(200).json(torneos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener torneos", error });
  }
};

// Obtener un torneo por ID
export const obtenerTorneoPorId = async (req, res) => {
  try {
    const torneo = await Torneo.findById(req.params.id)
      .populate({
        path: "equipos",
        select: "nombre logo torneos estadisticasGlobales",
      })
      .populate("partidos")
      .populate("goleadores.jugador")
      .populate("asistentes.jugador");

    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    const equiposConEstadisticas = torneo.equipos.map((equipo) => {
      const estadisticasDelTorneo = equipo.torneos.find(
        (torneo) => torneo.torneoId.toString() === req.params.id
      );

      return {
        _id: equipo._id,
        nombre: equipo.nombre,
        logo: equipo.logo,
        estadisticasGlobales: equipo.estadisticasGlobales,
        estadisticasTorneo: estadisticasDelTorneo || null, // Puede ser null si no tiene estadísticas
      };
    });

    const torneo_especifico = equiposConEstadisticas.filter(
      (equipo) => equipo.estadisticasTorneo !== null
    );

    // Ordena los equipos por puntos (suponiendo que la propiedad es 'puntos')
    torneo_especifico.sort(
      (a, b) =>
        b.estadisticasTorneo.estadisticas.puntos -
        a.estadisticasTorneo.estadisticas.puntos
    );

    return res.status(200).json({ torneo_especifico, torneo });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el torneo", error });
  }
};

// Actualizar un torneo
export const actualizarTorneo = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el torneo", error });
  }
};

// Eliminar un torneo
export const eliminarTorneo = async (req, res) => {
  try {
    const torneoEliminado = await Torneo.findByIdAndDelete(req.params.id);
    if (!torneoEliminado) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }
    res.status(200).json({ message: "Torneo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el torneo", error });
  }
};

// Obtener un partido por ID
export const getPartidoByTorneo = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEquiposByTorneo = async (req, res) => {
  try {
    const { id } = req.params;
    const equipos = await TorneoModels.findById(id)
      .populate("equipos")
      .populate("partidos");

    if (!equipos)
      return res.status(404).json({ message: "Partido no encontrado" });

    res.status(200).json(equipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un partido por ID
export const registerEquiposByTorneo = async (req, res) => {
  const { idTorneo, equipos } = req.body;

  try {
    const torneo = await Torneo.findById(idTorneo);

    if (!torneo) {
      return res.status(404).json({ message: "Torneo no encontrado" });
    }

    for (const teamId of equipos) {
      const equipoFound = await EquipoModel.findById(teamId);

      if (!equipoFound) {
        return res
          .satus(404)
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
        torneoId: torneo._id,
        estadisticas: { goles: 0, asistencias: 0, puntos: 0 },
      });
      await equipoFound.save();

      if (!torneo.equipos.includes(teamId)) {
        torneo.equipos.push(teamId);
      }
    }

    const torneosaved = await torneo.save();
    return res.status(200).json(torneosaved);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
