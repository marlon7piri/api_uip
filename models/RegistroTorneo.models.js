import  {mongoose,Schema} from "mongoose"

const registroSchema = new Schema({
  equipos: [{ type: Schema.Types.ObjectId, ref: "equipo", required: true }],
  
  torneo_id: { type: Schema.Types.ObjectId, ref: "torneo", required: true },
  
});
export default mongoose.model("registroTorneo", registroSchema);
