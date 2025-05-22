import { Request, Response } from "express"
import Equipo from "../models/Equipo.models";
import JugadorModels from "../models/Jugador.models";
import Jugador from "../models/Jugador.models";

// Crear un nuevo jugador
export const crearJugador = async (req: Request, res: Response) => {
  try {
    const jugador = new Jugador(req.body);
    await jugador.save();
    res.status(201).json(jugador);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Obtener todos los jugadores
export const obtenerJugadores = async (req: Request, res: Response): Promise<any> => {
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



   
    return res.json(jugadores);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};
export const editarJugador = async (req: Request, res: Response): Promise<any> => {
  const jugador = req.body
  const { id } = req.params
  const { autorId } =  req.query

  try {

    const jugadorfound = await JugadorModels.findById(id)

    if (jugadorfound && jugadorfound.autorId !== autorId) {
      return res.status(401).json({ message: "No puede editar este jugador" })
    }

    const updatedplayer = await JugadorModels.findByIdAndUpdate(id, jugador, { new: true })

    if (!updatedplayer) {
      return res.status(404).json({ message: "No se encontro el jugador" })
    }

    return res.status(201).json({ message: "Jugador actualizado", data: updatedplayer })
  } catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
}
// Obtener un jugador por ID
export const obtenerJugadorPorId = async (req: Request, res: Response): Promise<any> => {
  try {
    const jugador = await Jugador.findById(req.params.id).populate(
      "club",
      "nombre logo"
    );
    if (!jugador)
      return res.status(404).json({ message: "Jugador no encontrado" });
    res.json(jugador);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

export const deleteJugador = async (req: Request, res: Response): Promise<any> => {
  try {
    const jugador = await Jugador.findByIdAndDelete(req.params.id);
    if (!jugador) {
      return res.status(404).json({ message: "Jugador no encontrado" });

    }
    return res.status(200).json({ message: "Jugador eliminado" });
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};



// Actualizar un jugador por ID
export const actualizarJugador = async (req: Request, res: Response): Promise<any> => {
  try {
    const jugador = await Jugador.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!jugador)
      return res.status(404).json({ message: "Jugador no encontrado" });
    res.json(jugador);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

export const obtenerJugadorPorUserId = async (req: Request, res: Response): Promise<any> => {
  
};

// Eliminar un jugador por ID
export const eliminarJugador = async (req: Request, res: Response): Promise<any> => {
  try {
    const jugador = await Jugador.findByIdAndDelete(req.params.id);
    if (!jugador)
      return res.status(404).json({ message: "Jugador no encontrado" });
    res.json({ message: "Jugador eliminado correctamente" });
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Obtener un jugador por ID
export const obtenerJugadorPorEquipo = async (req: Request, res: Response): Promise<any> => {
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
  } catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};
