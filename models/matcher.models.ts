// models/ProximosPartidos.models.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interfaz para el documento de los próximos partidos
export interface IProximoPartido extends Document {
  autorId: string;
  local: mongoose.Types.ObjectId;
  visitante: mongoose.Types.ObjectId;
  torneo_id: mongoose.Types.ObjectId;
  tipo: string;
  resultado: {
    golesLocal: number;
    golesVisitante: number;
    asistenciasLocal: number;
    asistenciasVisitante: number;
    goleadores: mongoose.Types.ObjectId[];
    asistentes: mongoose.Types.ObjectId[];
  };
  fecha: Date;
  estadio: string;
  estado: string;
}

// Esquema para los próximos partidos
const proximosPartidosSchema: Schema<IProximoPartido> = new Schema({
  autorId: {
    type: String,
    required: true,
  },
  local: { type: Schema.Types.ObjectId, ref: "equipo", required: true },
  visitante: { type: Schema.Types.ObjectId, ref: "equipo", required: true },
  torneo_id: { type: Schema.Types.ObjectId, ref: "torneo", required: true },
  tipo: { type: String, required: true, default: "clasificacion" },
  resultado: {
    golesLocal: { type: Number, default: 0 },
    golesVisitante: { type: Number, default: 0 },
    asistenciasLocal: { type: Number, default: 0 },
    asistenciasVisitante: { type: Number, default: 0 },
    goleadores: [{ type: Schema.Types.ObjectId, ref: "jugadore", default: [] }],
    asistentes: [{ type: Schema.Types.ObjectId, ref: "jugadore", default: [] }],
  },
  fecha: { type: Date, required: true },
  estadio: { type: String },
  estado: {
    type: String,
    default: "pendiente",
  },
});

// Modelo para los próximos partidos
const ProximoPartido: Model<IProximoPartido> = mongoose.model<IProximoPartido>("matcher", proximosPartidosSchema);

export default ProximoPartido;
