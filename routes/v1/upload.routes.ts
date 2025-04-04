import express, { Response,Request } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { api_key, api_secret, cloud_name } from "../../config";


// Configurar Cloudinary
cloudinary.config({
  cloud_name,
  api_key,
  api_secret
});


const RouterUpload = express.Router();

// Configurar multer para manejo de archivos
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Ruta para subir imágenes a Cloudinary
RouterUpload.post("/upload", upload.single("image"), async (req: Request, res: Response):Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se proporcionó ningún archivo." });
    }

    // Subir imagen a Cloudinary



   
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "jugadores", // Opcional: especifica una carpeta en Cloudinary,
     

    });
    

    return res.status(200).json({
      message: "Imagen cargada con éxito.",
      url: result.secure_url, // URL pública de la imagen cargada
    });
  } catch (error) {
    console.error("Error al cargar la imagen:", error);
    return res.status(500).json({ message: "Error al cargar la imagen.", error });
  }
});

export default RouterUpload

