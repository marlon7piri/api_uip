// models/Jugador.js
import  mongoose from "mongoose"


const jugadorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    edad: { type: Number, required: true },
    estatura: { type: Number, required: true },
    foto: { type: String, required: true },
    estadisticasGlobales: {
      goles: { type: Number, default: 0 },
      asistencias: { type: Number, default: 0 },
      valor_mercado: { type: Number,default:0 },
      posicion: { type: String},
      velocidad: { type: Number, default: 50 },
      ataque: { type: Number, default: 50 },
      defensa: { type: Number, default: 50 },
      regate: { type: Number, default: 50 },
      tarjetas_amarillas: { type: Number, default: 0 },
      tarjetas_rojas: { type: Number, default: 0 },

    },
    rol: { type: String, default: 'jugador' },
    email: { type: String, required: true },
    estudiante: { type: String, required: true },
    status: { type: String, default: "activo" },
    club: { type: mongoose.Schema.Types.ObjectId, ref: "equipo" }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("jugadore", jugadorSchema);
