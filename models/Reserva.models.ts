import mongoose, { Schema, Document } from "mongoose";
type Estado = "pendiente" | "confirmado" | "cancelado";

export interface ReservaDocument extends Document {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  userId: mongoose.Types.ObjectId;
  canchaId: mongoose.Types.ObjectId;
  estado: Estado;
}

const reservaSchema:Schema<ReservaDocument> = new Schema<ReservaDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    allDay: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    canchaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cancha",
      required: true,
    },
    estado: {
      type: String,
      default: "pendiente",
    },
  },
  {
    timestamps: true, // Crea createdAt y updatedAt automáticamente
  }
);

const Reserva = mongoose.model<ReservaDocument>("Reserva", reservaSchema);
export default Reserva;
