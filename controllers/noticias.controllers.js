// controllers/ofertaController.js
import Noticia from "../models/Noticia.models.js";

// Crear una nueva oferta
export const createNoticia = async (req, res) => {
  try {
    const noticia = new Noticia(req.body);
    const savednoticia = await noticia.save();
    res.status(201).json(savednoticia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las ofertas
export const getNoticias = async (req, res) => {
  try {
    const noticias = await Noticia.find();

    res.status(200).json(noticias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una oferta por ID
export const getNoticiaById = async (req, res) => {
  try {
    const noticia = await Noticia.findById(req.params.id);

    if (!noticia)
      return res.status(404).json({ message: "Noticia no encontrada" });
    res.status(200).json(noticia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una oferta por ID
export const updateNoticia = async (req, res) => {
  try {
    const updatenoticia = await Noticia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatenoticia)
      return res.status(404).json({ message: "Noticia no encontrada" });
    res.status(200).json(updatenoticia);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una oferta por ID
export const deleteNoticia = async (req, res) => {
  try {
    const noticia = await Noticia.findByIdAndDelete(req.params.id);

    if (!noticia)
      return res.status(404).json({ message: "Noticia no encontrada" });

    res.status(200).json({ message: "Noticia eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
