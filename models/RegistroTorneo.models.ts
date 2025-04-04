// models/RegistroTorneo.models.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interfaz para el documento de RegistroTorneo
export interface IRegistroTorneo extends Document {
  equipos: mongoose.Types.ObjectId[]; // Lista de equipos que participan en el torneo
  torneo_id: mongoose.Types.ObjectId; // ID del torneo al que está registrado
}

// Esquema para el registro del torneo
const registroSchema: Schema<IRegistroTorneo> = new Schema(
  {
    equipos: [{ type: Schema.Types.ObjectId, ref: "equipo", required: true }],
    torneo_id: { type: Schema.Types.ObjectId, ref: "torneo", required: true },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Modelo para el registro del torneo
const RegistroTorneo: Model<IRegistroTorneo> = mongoose.model<IRegistroTorneo>("registroTorneo", registroSchema);

export default RegistroTorneo;
