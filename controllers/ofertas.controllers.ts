import {Request,Response} from "express"
import  Oferta from "../models/Oferta.models"

// Crear una nueva oferta
export const createOferta = async (req: Request, res: Response): Promise<any> => {
  try {
    const oferta = new Oferta(req.body);
    const savedOferta = await oferta.save();
    res.status(201).json(savedOferta);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Obtener todas las ofertas
export const getOfertas = async (req: Request, res: Response): Promise<any> =>{
  try {
    const ofertas = await Oferta.find()
      .populate({
        path: "jugador",
        populate: {
          path: "club", // Popula el club del jugador
          select: "nombre logo", // Selecciona solo los campos necesarios
        },
      })
      .populate("author");
    res.status(200).json(ofertas);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Obtener una oferta por ID
export const getOfertaById = async (req: Request, res: Response): Promise<any> => {
  try {
    const oferta = await Oferta.findById(req.params.id).populate(
      "jugador author"
    );
    if (!oferta)
      return res.status(404).json({ message: "Oferta no encontrada" });
    res.status(200).json(oferta);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Actualizar una oferta por ID
export const updateOferta = async (req: Request, res: Response): Promise<any> => {
  try {
    const updatedOferta = await Oferta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOferta)
      return res.status(404).json({ message: "Oferta no encontrada" });
    res.status(200).json(updatedOferta);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Eliminar una oferta por ID
export const deleteOferta = async (req: Request, res: Response): Promise<any> => {
  try {
    const deletedOferta = await Oferta.findByIdAndDelete(req.params.id);
    if (!deletedOferta)
      return res.status(404).json({ message: "Oferta no encontrada" });
    res.status(200).json({ message: "Oferta eliminada" });
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};
