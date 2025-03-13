// controllers/jugadorController.js
import Equipo from "../models/Equipo.models.js";
import JugadorModels from "../models/Jugador.models.js";
import Jugador from "../models/Jugador.models.js";

// Crear un nuevo jugador
export const crearJugador = async (req, res) => {
  try {
    const jugador = new Jugador(req.body);
    await jugador.save();
    res.status(201).json(jugador);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los jugadores
export const obtenerJugadores = async (req, res) => {
  const { query } = req.query;
  try {
    const jugadores = await Jugador.find(
      query
        ? {
          $or: [
            { nombre: { $regex: query, $options: "i" } },
            { apellido: { $regex: query, $options: "i" } },
          ],
        }
        : {}
    ).populate("club", "nombre logo");
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const editarJugador = async (req, res) => {
  const jugador = req.body
  const { id } = req.params

  try {
    const updatedplayer = await JugadorModels.findByIdAndUpdate(id, jugador, { new: true })

    if (!updatedplayer) {
      return res.status(404).json({ message: "No se encontro el jugador" })
    }

    return res.status(201).json({ message: "Jugador actualizado", data: updatedplayer })
  } catch (error) {
    res.status(500).json({ message: error.message });

  }
}
// Obtener un jugador por ID
export const obtenerJugadorPorId = async (req, res) => {
  try {
    const jugador = await Jugador.findById(req.params.id).populate(
      "club",
      "nombre logo"
    );
    if (!jugador)
      return res.status(404).json({ message: "Jugador no encontrado" });
    res.json(jugador);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJugador = async (req, res) => {
  try {
    const jugador = await Jugador.findByIdAndDelete(req.params.id);
    if (!jugador){
      return res.status(404).json({ message: "Jugador no encontrado" });

    }
    return res.status(200).json({ message: "Jugador eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Actualizar un jugador por ID
export const actualizarJugador = async (req, res) => {
  try {
    const jugador = await Jugador.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!jugador)
      return res.status(404).json({ message: "Jugador no encontrado" });
    res.json(jugador);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un jugador por ID
export const eliminarJugador = async (req, res) => {
  try {
    const jugador = await Jugador.findByIdAndDelete(req.params.id);
    if (!jugador)
      return res.status(404).json({ message: "Jugador no encontrado" });
    res.json({ message: "Jugador eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un jugador por ID
export const obtenerJugadorPorEquipo = async (req, res) => {
  try {
    const { id } = req.params;

    const equipo = await Equipo.findById(id);

    if (!equipo) {
      return res.status(404).json({ message: "No existen ese equipo" });
    }

    const jugadores = await Jugador.find({ club: equipo._id });

    if (!jugadores) {
      return res
        .status(404)
        .json({ message: "No existen Jugadores para este equipo" });
    }

    res.json({ jugadores: jugadores, infoClub: equipo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
