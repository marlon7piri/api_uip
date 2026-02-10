import mongoose, { Schema, Document, Model } from "mongoose";

/* =========================
   Tipos internos
========================= */

interface EstadisticasBase {
  goles_favor: number;
  goles_contra: number;
  asistencias: number;
  partidos_jugados: number;
  partidos_ganados: number;
  partidos_empatados: number;
  partidos_perdidos: number;
}

interface EstadisticasTorneo extends EstadisticasBase {
  puntos: number;
}

interface ParticipacionTorneo {
  torneoId?: mongoose.Types.ObjectId;
  grupo?: string; // A, B, C... (si aplica)
  estadisticas: EstadisticasTorneo;
}

/* =========================
   Interface principal
========================= */

export interface IEquipo extends Document {
  autorId: string;
  nombre: string;
  logo?: string;

  estadisticasGlobales: EstadisticasBase;

  torneos?: ParticipacionTorneo[];

  createdAt?: Date;
  updatedAt?: Date;
}

/* =========================
   Schema
========================= */

const EstadisticasBaseSchema = new Schema(
  {
    goles_favor: { type: Number, default: 0 },
    goles_contra: { type: Number, default: 0 },
    asistencias: { type: Number, default: 0 },
    partidos_jugados: { type: Number, default: 0 },
    partidos_ganados: { type: Number, default: 0 },
    partidos_empatados: { type: Number, default: 0 },
    partidos_perdidos: { type: Number, default: 0 },
  },
  { _id: false }
);

const EstadisticasTorneoSchema = new Schema(
  {
    ...EstadisticasBaseSchema.obj,
    puntos: { type: Number, default: 0 },
  },
  { _id: false }
);

const ParticipacionTorneoSchema = new Schema(
  {
    torneoId: {
      type: Schema.Types.ObjectId,
      ref: "torneo",
      
    },
    grupo: {
      type: String,
      enum: ["A", "B", "C", "D", "E", "F"],
    },
    estadisticas: {
      type: EstadisticasTorneoSchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

const equipoSchema: Schema<IEquipo> = new Schema(
  {
    autorId: {
      type: String,
      required: true,
    },

    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
    },

    estadisticasGlobales: {
      type: EstadisticasBaseSchema,
      default: () => ({}),
    },

    torneos: {
      type: [ParticipacionTorneoSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   Indexes (performance)
========================= */

equipoSchema.index({ nombre: 1 });
equipoSchema.index({ "torneos.torneoId": 1 });

/* =========================
   Model
========================= */

const Equipo: Model<IEquipo> = mongoose.model<IEquipo>(
  "equipo",
  equipoSchema
);

export default Equipo;
