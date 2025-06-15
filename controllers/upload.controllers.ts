import express, { Response, Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { api_key, api_secret, cloud_name } from "./../config";

// Configurar Cloudinary
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const RouterUpload = express.Router();

// Configurar multer para manejo de archivos
const storage = multer.memoryStorage();

const upload = multer({ storage });

export const uploadPhoto = [
  upload.single("image"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No se proporcionó ningún archivo." });
      }

      // Subir imagen a Cloudinary
      const base64 = req.file.buffer.toString("base64");

      const dataUri = `data:${req.file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "jugadores", // Opcional: especifica una carpeta en Cloudinary,
      });

      return res.status(200).json({
        message: "Imagen cargada con éxito.",
        url: result.secure_url, // URL pública de la imagen cargada
      });
    } catch (error) {
      console.error("Error al cargar la imagen:", error);
      return res
        .status(500)
        .json({ message: "Error al cargar la imagen.", error });
    }
  },
];

export const uploadVideo = [
  upload.single("video"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No se proporcionó ningún archivo." });
      }

      // Convertir buffer a base64
      const base64 = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;

      // Subir el video a Cloudinary directamente desde el buffer
      const result = await cloudinary.uploader.upload(dataUri, {
        resource_type: "video",
        folder: "videos_uip",
      });

      //Aqui podemos guardar la url y el public_id del video del usuario en la base de datos

      return res.status(201).json({
        message: "Video subido correctamente",
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      console.error("Error al subir el video:", error);
      return res
        .status(500)
        .json({ message: "Error al subir el video.", error });
    }
  },
];
