import mongoose, { Schema, Document } from "mongoose";

export type TypeComodidades =
  | "Restaurante"
  | "Wifi"
  | "Baños"
  | "Duchas"
  | "Estacionamiento gratis";

export interface ICancha extends Document {
  _id: string;
  nombre: string;
  direccion: string;
  horario: string;
  telefono?: string;
  precioPorHora?: number;
  userId:mongoose.Types.ObjectId
  tipo?: "fútbol" | "baloncesto" | "tenis" | "padel" | "multiuso";
  imagenUrl?: string;
  ubicacion: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  comodidades?: TypeComodidades[];
  createdAt?: Date;
  updatedAt?: Date;
}

const canchaSchema: Schema<ICancha> = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      required: true,
    },
    userId:{ type: Schema.Types.ObjectId, ref: "users", required: true },
    horario: {
      type: String,
      required: true,
    },
    telefono: {
      type: String,
    },
    precioPorHora: {
      type: Number,
    },
    
    tipo: {
      type: String,
      enum: ["fútbol", "baloncesto", "tenis", "padel", "multiuso"],
    },
    imagenUrl: {
      type: String,
    },
    // 📍 Geolocalización con índice 2dsphere
    ubicacion: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    comodidades: {
      type: [String],
      enum: [
        "Restaurante",
        "Wifi",
        "Baños",
        "Duchas",
        "Estacionamiento gratis",
      ],
    },
  },
  {
    timestamps: true,
  }
);

// 📌 Índice geoespacial 2dsphere
canchaSchema.index({ ubicacion: "2dsphere" });

export default mongoose.models.Cancha || mongoose.model<ICancha>("Cancha", canchaSchema);

