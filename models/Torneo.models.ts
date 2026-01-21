import mongoose, { Schema, Document, Model } from "mongoose";


export interface IOTorneo extends Document {
  _id: mongoose.Types.ObjectId,
  nombre: string,
  foto: string,
  equipos: mongoose.Types.ObjectId[],
  partidos: mongoose.Types.ObjectId[],
  goleadores: Array<{
    jugador: mongoose.Types.ObjectId,
    cantidad: number
  }>,
  asistentes: Array<{
    jugador: mongoose.Types.ObjectId,
    cantidad: number
  }>,
  sancionados_roja: Array<{
    jugador: mongoose.Types.ObjectId,
    cantidad: number
  }>,
  sancionados_amarilla: Array<{
    jugador: mongoose.Types.ObjectId,
    cantidad: number
  }>,
  autorId: string,
  fechaInicio:Date
}
type ITorneoDoc = Document & IOTorneo;

const torneoSchema: Schema<ITorneoDoc> = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
    required: true,
  },
  equipos: [{ type: mongoose.Schema.Types.ObjectId, ref: "equipo" }],
  partidos: [{ type: mongoose.Schema.Types.ObjectId, ref: "matcher" }],
  goleadores: [
    {
      jugador: { type: mongoose.Schema.Types.ObjectId, ref: "jugadore" },
      cantidad: { type: Number },
    },
  ],
  asistentes: [
    {
      jugador: { type: mongoose.Schema.Types.ObjectId, ref: "jugadore" },
      cantidad: { type: Number },
    },
  ],
  sancionados_roja: [
    {
      jugador: { type: mongoose.Schema.Types.ObjectId, ref: "jugadore" },
      cantidad: { type: Number },
    },
  ],
  sancionados_amarilla: [
    {
      jugador: { type: mongoose.Schema.Types.ObjectId, ref: "jugadore" },
      cantidad: { type: Number },
    },
  ],
  autorId: {
    type: String,
    required: true
  },
  fechaInicio:{
    type:Date
  }
});
const Torneo: Model<IOTorneo> = mongoose.model<IOTorneo>("torneo", torneoSchema)
export default Torneo;
