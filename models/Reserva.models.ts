import mongoose, { Schema, Document } from 'mongoose'

export interface ReservaDocument extends Document {
  title: string
  start: Date
  end: Date
  allDay?: boolean
  userId: mongoose.Types.ObjectId
  canchaId: mongoose.Types.ObjectId
}

const reservaSchema = new Schema<ReservaDocument>(
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
      ref: 'Users',
      required: true,
    },
    canchaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cancha',
      required: true,
    },
  },
  {
    timestamps: true, // Crea createdAt y updatedAt automáticamente
  }
)

const Reserva = mongoose.model<ReservaDocument>('Reserva', reservaSchema)
export default Reserva
