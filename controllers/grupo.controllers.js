import EquipoModels from "../models/Equipo.models.js";
import GrupoModels from "../models/Grupo.models.js";

export const createGrupo = async (req, res) => {
  const { nombre, cantidad_equipos, cantidad_grupos, grupos } = req.body;
  try {
    const newGroup = new GrupoModels({
      nombre,
      cantidad_equipos,
      cantidad_grupos,
      grupos,
    });

    const grupo = await newGroup.save();

    for (const elemento of grupos) {
      for (const id of elemento.equipos) {
        const equipofound = await EquipoModels.findById(id);

        if (!equipofound) {
          return res
            .status(400)
            .json({ message: `El equipo con id: ${teamId} no se encuentra` });
        }
        equipofound.torneos.push({
          torneoId: grupo._id,
          estadisticas: {
            puntos: 0,
            asistencias: 0,
            goles_favor: 0,
            goles_contra: 0,
            partidos_jugados: 0,
            partidos_ganados: 0,
            partidos_perdidos: 0,
            partidos_empatados: 0,
          },
        });

        await equipofound.save();
      }
    }

    return res.status(200).json({ message: "Grupo creado", data: grupo });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor", error });
  }
};

export const getGrupos = async (req, res) => {
  try {
    const grupos = await GrupoModels.find().populate(
      "grupos.equipos",
      "nombre  torneos"
    );

    return res.status(200).json({ data: grupos });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor", error });
  }
};
export const getGrupoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await GrupoModels.findById(id).populate(
      "grupos.equipos",
      "nombre   estadisticaTorneo torneos"
    );

    if (!result) {
      return res.status(400).json({ message: "No existe el grupo" });
    }

    let GrupoInfo = {};
    for (const grupo of result.grupos) {
      const data = grupo.equipos.map((equipo) => {
        console.log(equipo.nombre);
        const equipofound = equipo.torneos.find(
          (e) => e.torneoId.toString() === result._id.toString()
        );

        return {
          grupo: grupo.grupoName,
          equipo: equipo,
          estadisticaTorneo: equipofound.estadisticas,
        };
      });

      GrupoInfo = data;
    }

    return res.status(200).json({ data: GrupoInfo });
  } catch (error) {
    return res.status(500).json({ message: "Error del servidor", error });
  }
};
