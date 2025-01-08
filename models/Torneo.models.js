import  {mongoose,Schema} from "mongoose"

const torneoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  foto: {
    type: String,
    required: true,
  },
  equipos: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'equipo' }
  ],
  partidos: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'matcher' }
  ],
  goleadores: [

    {
      jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'jugadore' },
      cantidad: { type: Number }
    }
  ],
  asistentes: [
    {
      jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'jugadore' },
      cantidad: { type: Number }
    }
  ],
  sancionados_roja: [
    {
      jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'jugadore' },
      cantidad: { type: Number }
    }
  ],
  sancionados_amarilla: [
    {
      jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'jugadore' },
      cantidad: { type: Number }
    }
  ],

});

export default mongoose.model("torneo", torneoSchema);
