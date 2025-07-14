import { Request, Response } from "express";
import Cancha from "../models/Canchas.models";

// ✅ Crear una nueva cancha
export const crearCancha = async (req: Request, res: Response) => {
  try {
    const cancha = await Cancha.create(req.body);
    res.status(201).json(cancha);
  } catch (error) {
    console.error("Error al crear cancha:", error);
    res.status(500).json({ error: "Error al crear la cancha" });
  }
};

// ✅ Obtener todas las canchas
export const obtenerCanchas = async (_req: Request, res: Response) => {
  try {
    const canchas = await Cancha.find();
    res.json(canchas);
  } catch (error) {
    console.error("Error al obtener canchas:", error);
    res.status(500).json({ error: "Error al obtener las canchas" });
  }
};

// ✅ Obtener una cancha por ID
export const obtenerCanchaPorId = async (req: Request, res: Response) => {
  try {
    const cancha = await Cancha.findById(req.params.id);
    if (!cancha) return res.status(404).json({ error: "Cancha no encontrada" });
    res.json(cancha);
  } catch (error) {
    console.error("Error al obtener cancha:", error);
    res.status(500).json({ error: "Error al obtener la cancha" });
  }
};


// ✅ Obtener una cancha por ID
export const obtenerCanchaPorUserId = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id)
    const cancha = await Cancha.find({userId:req.params.id});

    if (!cancha) return res.status(404).json({ error: "Cancha no encontrada" });
    res.json(cancha);
  } catch (error) {
    console.error("Error al obtener cancha:", error);
    res.status(500).json({ error: "Error al obtener la cancha" });
  }
};
// ✅ Actualizar una cancha por ID
export const actualizarCancha = async (req: Request, res: Response) => {
  try {
    const cancha = await Cancha.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!cancha) return res.status(404).json({ error: "Cancha no encontrada" });
    res.json(cancha);
  } catch (error) {
    console.error("Error al actualizar cancha:", error);
    res.status(500).json({ error: "Error al actualizar la cancha" });
  }
};

// ✅ Eliminar una cancha por ID
export const eliminarCancha = async (req: Request, res: Response) => {
  try {
    const cancha = await Cancha.findByIdAndDelete(req.params.id);
    if (!cancha) return res.status(404).json({ error: "Cancha no encontrada" });
    res.json({ mensaje: "Cancha eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar cancha:", error);
    res.status(500).json({ error: "Error al eliminar la cancha" });
  }
};

// ✅ Buscar canchas cercanas (ya lo tenías)
export const obtenerCanchasCercanas = async (req: Request, res: Response) => {
  const { lat, lng } = req.query;
  if (!lat || !lng)
    return res.status(400).json({ error: "lat y lng son requeridos" });

  try {
    const latNum = parseFloat(lat as string);
    const lngNum = parseFloat(lng as string);

    const canchas = await Cancha.find({
      ubicacion: {
        $near: {
          $geometry: { type: "Point", coordinates: [lngNum, latNum] },
          $maxDistance: 5000, // 5km
        },
      },
    });

    res.json(canchas);
  } catch (error) {
    console.error("Error al buscar canchas cercanas:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};
