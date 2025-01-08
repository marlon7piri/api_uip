// models/Equipo.js
import  mongoose from "mongoose"

const equipoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  estadisticasGlobales: {
    goles_favor: {
      type: Number,
      default: 0,
    },
    goles_contra: {
      type: Number,
      default: 0,
    },
    asistencias: {
      type: Number,
      default: 0,
    },

    partidos_jugados: {
      type: Number,
      default: 0,
    },
    partidos_ganados: {
      type: Number,
      default: 0,
    },
    partidos_perdidos: {
      type: Number,
      default: 0,
    },
    partidos_empatados: {
      type: Number,
      default: 0,
    }
  },
  torneos: [
    {
      torneoId: { type: mongoose.Schema.Types.ObjectId, ref: 'torneo' },
      estadisticas: {
        puntos: { type: Number, default: 0 },
        asistencias: { type: Number, default: 0 },
        goles_favor: { type: Number, default: 0 },
        goles_contra: {type: Number,default: 0},
        partidos_jugados: {type: Number,default: 0 },
        partidos_ganados: {type: Number, default: 0},
        partidos_perdidos: { type: Number,default: 0},
        partidos_empatados: {type: Number,default: 0 }
      }
    }
  ]


});

export default mongoose.model("equipo", equipoSchema);
