// models/Jugador.models.ts
import mongoose, { Document, Schema, Model } from "mongoose";

interface EstadisticasGlobales {
  goles: number;
  asistencias: number;
  valor_mercado: number;
  posicion?: string;
  velocidad: number;
  ataque: number;
  defensa: number;
  regate: number;
  tarjetas_amarillas: number;
  tarjetas_rojas: number;
}

export interface IJugador extends Document {
  autorId: string;
  nombre: string;
  apellido: string;
  edad: number;
  estatura: number;
  foto: string;
  estadisticasGlobales: EstadisticasGlobales;
  rol: string;
  email: string;
  estudiante: string;
  status: string;
  club: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const jugadorSchema: Schema<IJugador> = new Schema(
  {
    autorId: {
      type: String,
      required: true,
    },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    edad: { type: Number, required: true },
    estatura: { type: Number, required: true },
    foto: { type: String, required: true },
    estadisticasGlobales: {
      goles: { type: Number, default: 0 },
      asistencias: { type: Number, default: 0 },
      valor_mercado: { type: Number, default: 0 },
      posicion: { type: String },
      velocidad: { type: Number, default: 50 },
      ataque: { type: Number, default: 50 },
      defensa: { type: Number, default: 50 },
      regate: { type: Number, default: 50 },
      tarjetas_amarillas: { type: Number, default: 0 },
      tarjetas_rojas: { type: Number, default: 0 },
    },
    rol: { type: String, default: "jugador" },
    email: { type: String, required: true },
    estudiante: { type: String, required: true },
    status: { type: String, default: "activo" },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "equipo" },
  },
  {
    timestamps: true,
  }
);

const Jugador: Model<IJugador> = mongoose.model<IJugador>("jugadore", jugadorSchema);

export default Jugador;
