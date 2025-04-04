// models/Grupo.models.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interfaz para el documento del grupo
export interface IGrupo extends Document {
  autorId: string;
  nombre: string;
  cantidad_equipos: number;
  cantidad_grupos: number;
  grupos: Array<{
    equipos: mongoose.Types.ObjectId[];
    grupoName: string;
  }>;
}

// Esquema para el grupo
const grupoSchema: Schema<IGrupo> = new Schema({
  autorId: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  cantidad_equipos: {
    type: Number,
    required: true,
  },
  cantidad_grupos: {
    type: Number,
    required: true,
  },
  grupos: [
    {
      equipos: [{ type: Schema.Types.ObjectId, ref: "equipo" }],
      grupoName: { type: String },
    },
  ],
});

const Grupo: Model<IGrupo> = mongoose.model<IGrupo>("grupo", grupoSchema);

export default Grupo;
