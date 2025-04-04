// models/Oferta.models.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interfaz para el documento de Oferta
export interface IOferta extends Document {
  jugador: mongoose.Types.ObjectId;  // ID del jugador
  author: mongoose.Types.ObjectId;   // ID del autor de la oferta
  monto: number;                     // Monto de la oferta
  descripcion: string;               // Descripción de la oferta
  fechaCreacion: Date;               // Fecha de creación de la oferta
}

// Esquema para la oferta
const ofertaSchema: Schema<IOferta> = new Schema(
  {
    jugador: { type: Schema.Types.ObjectId, ref: "jugadore", required: true },
    author: { type: Schema.Types.ObjectId, ref: "users", required: true },
    monto: { type: Number, required: true },
    descripcion: { type: String, required: true },
    fechaCreacion: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Modelo para la oferta
const Oferta: Model<IOferta> = mongoose.model<IOferta>("oferta", ofertaSchema);

export default Oferta;
