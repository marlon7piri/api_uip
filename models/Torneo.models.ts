import mongoose, { Schema, Document, Model } from "mongoose";

export type FormatoTorneo = 'liga' | 'torneo';

/* =======================
   GRUPOS
======================= */
const grupoSchema = new Schema(
  {
    nombre: { type: String, required: true },
    equipos: [{ type: Schema.Types.ObjectId, ref: 'equipo' }],
  },
  { _id: false }
);

/* =======================
   INTERFAZ
======================= */
export interface ITorneo extends Document {
  nombre: string;
  foto: string;
  formato: FormatoTorneo;
  grupos?: {
    nombre: string;
    equipos: mongoose.Types.ObjectId[];
  }[];
  equipos: mongoose.Types.ObjectId[];
  partidos: mongoose.Types.ObjectId[];
  autorId: string;
  fechaInicio: Date;
}

/* =======================
   ESQUEMA
======================= */
const torneoSchema = new Schema<ITorneo>(
  {
    nombre: { type: String, required: true },
    foto: { type: String, required: true },

    formato: {
      type: String,
      enum: ['liga', 'torneo'],
      required: true,
    },

    grupos: [grupoSchema],

    equipos: [{ type: Schema.Types.ObjectId, ref: 'equipo' }],
    partidos: [{ type: Schema.Types.ObjectId, ref: 'matcher' }],

    autorId: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
  },
  { timestamps: true }
);

/* =======================
   VALIDACIÓN
======================= */
torneoSchema.pre('save', function (next) {
  if (this.formato === 'liga' && this.grupos && this.grupos.length > 0) {
    return next(new Error('Un torneo tipo liga no puede tener grupos'));
  }
  next();
});

/* =======================
   MODELO
======================= */
const Torneo: Model<ITorneo> = mongoose.model<ITorneo>('torneo', torneoSchema);
export default Torneo;
