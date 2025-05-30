import { Request, Response } from "express"
import Equipo from "../models/Equipo.models";
import JugadorModels, { IJugador } from "../models/Jugador.models";
import Jugador from "../models/Jugador.models";

// Crear un nuevo jugador
export const crearJugador = async (req: Request, res: Response) => {
  try {
    const jugador = new Jugador(req.body);
    await jugador.save();
    res.status(201).json(jugador);
  } catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

export const obtenerJugadores = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page = '1', name = '' } = req.query;

    const parsedPage = parseInt(page as string, 10);
    const currentPage = isNaN(parsedPage) ? 1 : Math.max(parsedPage, 1);
    const nameQuery = String(name || "").trim();

    const limit = 5;
    const skip = (currentPage - 1) * limit;

    const filtro = nameQuery
      ? {
          $or: [
            { nombre: { $regex: nameQuery, $options: 'i' } },
            { apellido: { $regex: nameQuery, $options: 'i' } },
          ],
        }
      : {};

    const total = await Jugador.countDocuments(filtro);

    const jugadores = await Jugador.find(filtro)
      .populate("club", "nombre logo")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }) // si usas timestamps
      .lean();

    const hasMore = skip + jugadores.length < total;

    return res.json({
      jugadores,
      pagination: {
        total,
        currentPage,
        totalPages: Math.ceil(total / limit),
        hasMore,
      },
    });

  } catch (error: unknown) {
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
  const { autorId } = req.query

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
  } catch (error: unknown) {

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
  } catch (error: unknown) {

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
  } catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

export const obtenerJugadorPorUserId = async (req: Request, res: Response): Promise<any> => {
  try {
    const jugador = await Jugador.findOne({ userId: req.params.id }).populate(
      "club",
      "nombre logo"
    );
    if (!jugador) {

      const { email } = req.query

      const jugadorId = await Jugador.findOne({ email }).populate(
        "club",
        "nombre logo"
      );


      if (!jugadorId) {
        return res.status(404).json({ message: "Jugador no encontrado" });
      }

      return res.status(200).json(jugadorId);
    }
    return res.json(jugador);
  } catch (error: unknown) {

    if (error instanceof Error) {

      return res.status(500).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

// Eliminar un jugador por ID
export const eliminarJugador = async (req: Request, res: Response): Promise<any> => {
  try {
    const jugador = await Jugador.findByIdAndDelete(req.params.id);
    if (!jugador)
      return res.status(404).json({ message: "Jugador no encontrado" });
    res.json({ message: "Jugador eliminado correctamente" });
  } catch (error: unknown) {

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



// Crear un nuevo jugador
export const crearJugadoresMasivos = async (req: Request, res: Response) => {
  try {

    for (let i = 0; i < 100; i++) {
      const jugador = new Jugador<IJugador>({ ...req.body, foto: "" });
      await jugador.save();
      res.status(201).json({ message: "jugadores creados" + i });
    }


  } catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};