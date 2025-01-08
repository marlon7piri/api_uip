// models/Oferta.js
import  {mongoose,Schema} from "mongoose"


const ofertaSchema = new Schema({
  jugador: { type: Schema.Types.ObjectId, ref: "jugadore", required: true },
  author: { type: Schema.Types.ObjectId, ref: "users", required: true },
  monto: { type: Number, required: true },
  descripcion: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now },
});

export default mongoose.model("oferta", ofertaSchema);
