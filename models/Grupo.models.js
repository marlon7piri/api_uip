import { mongoose, Schema } from "mongoose";

const grupoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  cantidad_equipos: {
    type: Number,
    required: true,
  },
  cantidad_grupos: {
    type: Number,
    required: true,
  },
  grupos: [
    {
      equipos: [{ type: Schema.Types.ObjectId, ref: "equipo" }],
      grupoName: String,
    },
  ],
});

export default mongoose.model("grupo", grupoSchema);
