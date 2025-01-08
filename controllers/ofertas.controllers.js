// controllers/ofertaController.js
import  Oferta from "../models/Oferta.models.js"

// Crear una nueva oferta
export const createOferta = async (req, res) => {
  try {
    const oferta = new Oferta(req.body);
    const savedOferta = await oferta.save();
    res.status(201).json(savedOferta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las ofertas
export const getOfertas = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una oferta por ID
export const getOfertaById = async (req, res) => {
  try {
    const oferta = await Oferta.findById(req.params.id).populate(
      "jugador author"
    );
    if (!oferta)
      return res.status(404).json({ message: "Oferta no encontrada" });
    res.status(200).json(oferta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una oferta por ID
export const updateOferta = async (req, res) => {
  try {
    const updatedOferta = await Oferta.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOferta)
      return res.status(404).json({ message: "Oferta no encontrada" });
    res.status(200).json(updatedOferta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar una oferta por ID
export const deleteOferta = async (req, res) => {
  try {
    const deletedOferta = await Oferta.findByIdAndDelete(req.params.id);
    if (!deletedOferta)
      return res.status(404).json({ message: "Oferta no encontrada" });
    res.status(200).json({ message: "Oferta eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
