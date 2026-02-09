import mongoose, { Schema, Document, Model } from "mongoose";

export type FormatoTorneo = "liga" | "grupos";

interface Grupo {
  nombre: string; // A, B, C...
  equipos: mongoose.Types.ObjectId[];
}

export interface ITorneo extends Document {
  autorId: string;
  nombre: string;
  foto?: string;
  formato: FormatoTorneo;
  cantidadGrupos?: number;
  grupos?: Grupo[];
  equipos: mongoose.Types.ObjectId[];
  partidos: mongoose.Types.ObjectId[];
  fechaInicio: Date;
}

const grupoSchema = new Schema(
  {
    nombre: { type: String, required: true },
    equipos: [{ type: Schema.Types.ObjectId, ref: "equipo" }],
  },
  { _id: false }
);

const torneoSchema = new Schema<ITorneo>(
  {
    autorId: { type: String, required: true },
    nombre: { type: String, required: true },
    foto: String,

    formato: {
      type: String,
      enum: ["liga", "grupos"],
      required: true,
    },

    cantidadGrupos: {
      type: Number,
      min: 1,
    },

    grupos: [grupoSchema],

    equipos: [{ type: Schema.Types.ObjectId, ref: "equipo" }],
    partidos: [{ type: Schema.Types.ObjectId, ref: "matcher" }],

    fechaInicio: { type: Date, required: true },
  },
  { timestamps: true }
);

const Torneo: Model<ITorneo> = mongoose.model("torneo", torneoSchema);
export default Torneo;
