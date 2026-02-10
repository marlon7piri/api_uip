// models/Jugador.models.ts
import mongoose, { Document, Schema, Model } from "mongoose";

interface EstadisticasGlobales {
  goles: number;
  asistencias: number;
  posicion?: string;
  tarjetas_amarillas: number;
  tarjetas_rojas: number;
}

export interface IJugador extends Document {
  nombre: string;
  apellido: string;
  edad: number;
  estatura: number;
  foto: string;
  estadisticasGlobales: EstadisticasGlobales;
  rol: string[];
  email: string;
  status: string;
  club: mongoose.Types.ObjectId;
  userId: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const jugadorSchema: Schema<IJugador> = new Schema(
  {

    nombre: { type: String, required: true },
    edad: { type: Number },
    estatura: { type: Number },
    foto: { type: String},
    estadisticasGlobales: {
      goles: { type: Number, default: 0 },
      asistencias: { type: Number, default: 0 },
      posicion: { type: String },
      tarjetas_amarillas: { type: Number, default: 0 },
      tarjetas_rojas: { type: Number, default: 0 },
    },
    rol: [{ type: String, default: "jugador" }],
    userId: { type: String},
    club: { type: mongoose.Schema.Types.ObjectId, ref: "equipo" },
  },
  {
    timestamps: true,
  }
);

const Jugador: Model<IJugador> = mongoose.model<IJugador>("jugadore", jugadorSchema);

export default Jugador;
