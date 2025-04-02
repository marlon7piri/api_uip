// models/Oferta.js
import { mongoose, Schema } from "mongoose";

const noticiaSchema = new Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    subtitulo: {
      type: String,
      required: true,
    },
    foto: {
      type: String,
    },
    autorId:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("noticia", noticiaSchema);
