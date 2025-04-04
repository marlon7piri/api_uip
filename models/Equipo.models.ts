// models/Equipo.models.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface EstadisticasEquipo {
  goles_favor: number;
  goles_contra: number;
  asistencias: number;
  partidos_jugados: number;
  partidos_ganados: number;
  partidos_perdidos: number;
  partidos_empatados: number;
}

interface TorneoEstadisticas extends EstadisticasEquipo {
  puntos: number;
}

interface TorneoParticipacion {
  torneoId: mongoose.Types.ObjectId;
  estadisticas: TorneoEstadisticas;
}

export interface IEquipo extends Document {
  autorId: string;
  nombre: string;
  logo: string;
  estadisticasGlobales: EstadisticasEquipo;
  torneos: TorneoParticipacion[];
}

const equipoSchema: Schema<IEquipo> = new Schema({
  autorId: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  estadisticasGlobales: {
    goles_favor: { type: Number, default: 0 },
    goles_contra: { type: Number, default: 0 },
    asistencias: { type: Number, default: 0 },
    partidos_jugados: { type: Number, default: 0 },
    partidos_ganados: { type: Number, default: 0 },
    partidos_perdidos: { type: Number, default: 0 },
    partidos_empatados: { type: Number, default: 0 },
  },
  torneos: [
    {
      torneoId: { type: mongoose.Schema.Types.ObjectId, ref: "torneo" },
      estadisticas: {
        puntos: { type: Number, default: 0 },
        asistencias: { type: Number, default: 0 },
        goles_favor: { type: Number, default: 0 },
        goles_contra: { type: Number, default: 0 },
        partidos_jugados: { type: Number, default: 0 },
        partidos_ganados: { type: Number, default: 0 },
        partidos_perdidos: { type: Number, default: 0 },
        partidos_empatados: { type: Number, default: 0 },
      },
    },
  ],
});

const Equipo: Model<IEquipo> = mongoose.model<IEquipo>("equipo", equipoSchema);

export default Equipo;
