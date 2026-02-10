import mongoose, { Schema, Document, Model } from "mongoose";

/* =======================
   TIPOS
======================= */
export type MatcherType = 'amistoso' | 'liga' | 'clasificacion' | 'final';
export type StatusType = 'pendiente' | 'en_curso' | 'finalizado';
export type EventType = 'gol' | 'amarilla' | 'roja';

/* =======================
   EVENTOS DEL PARTIDO
======================= */
const eventoSchema = new Schema(
  {
    tipo: {
      type: String,
      enum: ['gol', 'amarilla', 'roja'],
      required: true,
    },
    jugador: {
      type: Schema.Types.ObjectId,
      ref: 'jugadore',
      required: true,
    },
    equipo: {
      type: Schema.Types.ObjectId,
      ref: 'equipo',
      required: true,
    },
    minuto: {
      type: Number,
      min: 0,
      max: 130,
    },
  },
  { _id: false }
);

/* =======================
   RESULTADO
======================= */
const resultadoSchema = new Schema(
  {
    golesLocal: { type: Number, default: 0 },
    golesVisitante: { type: Number, default: 0 },
  },
  { _id: false }
);

/* =======================
   INTERFAZ
======================= */
export interface IPartido extends Document {
  autorId: string;
  local: mongoose.Types.ObjectId;
  visitante: mongoose.Types.ObjectId;
  torneoId?: mongoose.Types.ObjectId;
  tipo: MatcherType;
  fecha: Date;
  cancha?: mongoose.Types.ObjectId;
  estado: StatusType;
  eventos: {
    tipo: EventType;
    jugador: mongoose.Types.ObjectId;
    equipo: mongoose.Types.ObjectId;
    minuto?: number;
  }[];
  resultado: {
    golesLocal: number;
    golesVisitante: number;
  };
}

/* =======================
   ESQUEMA
======================= */
const partidoSchema = new Schema<IPartido>(
  {
    autorId: { type: String, required: true },

    local: { type: Schema.Types.ObjectId, ref: 'equipo', required: true },
    visitante: { type: Schema.Types.ObjectId, ref: 'equipo', required: true },

    torneoId: { type: Schema.Types.ObjectId, ref: 'torneo' },

    tipo: {
      type: String,
      enum: ['amistoso', 'liga', 'clasificacion', 'final'],
      default: 'liga',
    },

    fecha: { type: Date, required: true },
    cancha: { type: Schema.Types.ObjectId, ref: 'cancha' },

    estado: {
      type: String,
      enum: ['pendiente', 'en_curso', 'finalizado'],
      default: 'pendiente',
    },

    eventos: [eventoSchema],
    resultado: {
      type: resultadoSchema,
      default: () => ({
        golesLocal: 0,
        golesVisitante: 0,
      }),
    },
  },
  { timestamps: true }
);

/* =======================
   MIDDLEWARE
   Recalcula goles
======================= */
partidoSchema.pre('save', function (next) {
  if (!this.resultado) {
    this.resultado = { golesLocal: 0, golesVisitante: 0 };
  }
  const golesLocal = this.eventos.filter(
    e => e.tipo === 'gol' && e.equipo.equals(this.local)
  ).length;

  const golesVisitante = this.eventos.filter(
    e => e.tipo === 'gol' && e.equipo.equals(this.visitante)
  ).length;

  this.resultado.golesLocal = golesLocal;
  this.resultado.golesVisitante = golesVisitante;

  next();
});

/* =======================
   MODELO
======================= */
const Partido: Model<IPartido> = mongoose.model<IPartido>('matcher', partidoSchema);
export default Partido;
