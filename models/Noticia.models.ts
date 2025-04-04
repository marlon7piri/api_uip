// models/Oferta.models.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interfaz para el documento de Noticia
export interface INoticia extends Document {
  titulo: string;
  subtitulo: string;
  foto?: string;
  autorId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Esquema para las noticias
const noticiaSchema: Schema<INoticia> = new Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    subtitulo: {
      type: String,
      required: true,
    },
    foto: {
      type: String,
    },
    autorId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Se generan los campos createdAt y updatedAt automáticamente
  }
);

// Modelo para las noticias
const Noticia: Model<INoticia> = mongoose.model<INoticia>("noticia", noticiaSchema);

export default Noticia;
