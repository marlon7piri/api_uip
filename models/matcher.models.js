// models/ProximosPartidos.js
import { mongoose, Schema } from "mongoose";

const proximosPartidosSchema = new Schema({
  autorId: {
    type: String,
    required: true
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

export default mongoose.model("matcher", proximosPartidosSchema);
