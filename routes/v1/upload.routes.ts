import express from "express";
import { uploadPhoto, uploadVideo } from "controllers/upload.controllers";
import { isAuth } from "middleware/auth";

const RouterUpload = express.Router();

// Ruta para subir imágenes  y videos a Cloudinary
RouterUpload.post("/upload", isAuth, uploadPhoto);

RouterUpload.post("/video", isAuth, uploadVideo);

export default RouterUpload;
