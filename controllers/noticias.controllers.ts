import {Request,Response} from "express"
import Noticia from "../models/Noticia.models";

// Crear una nueva oferta
export const createNoticia = async (req: Request, res: Response): Promise<any> => {
  try {
    const noticia = new Noticia(req.body);
    const savednoticia = await noticia.save();
    res.status(201).json(savednoticia);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Obtener todas las ofertas
export const getNoticias = async (req: Request, res: Response): Promise<any> => {
  try {
    const noticias = await Noticia.find();

    res.status(200).json(noticias);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Obtener una oferta por ID
export const getNoticiaById = async (req: Request, res: Response): Promise<any> => {
  try {
    const noticia = await Noticia.findById(req.params.id);

    if (!noticia)
      return res.status(404).json({ message: "Noticia no encontrada" });
    res.status(200).json(noticia);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Actualizar una oferta por ID
export const updateNoticia = async (req: Request, res: Response): Promise<any> =>{
  try {
    const updatenoticia = await Noticia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatenoticia)
      return res.status(404).json({ message: "Noticia no encontrada" });
    res.status(200).json(updatenoticia);
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};

// Eliminar una oferta por ID
export const deleteNoticia = async (req: Request, res: Response): Promise<any> => {
  try {
    const noticia = await Noticia.findByIdAndDelete(req.params.id);

    if (!noticia)
      return res.status(404).json({ message: "Noticia no encontrada" });

    res.status(200).json({ message: "Noticia eliminada" });
  }catch (error: unknown) {

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }

  }
};
