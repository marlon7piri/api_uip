import { Types } from "mongoose";
import { IEquipo } from "./equipos";

export interface ITorneo {
    _id: Types.ObjectId;
    nombre: string;
    foto: string;
    equipos: Types.ObjectId[];
    partidos: string[];
    autorId: string;
    goleadores: Array<{ jugador: string; cantidad: number }>;
    asistentes: Array<{ jugador: string; cantidad: number }>;
    sancionados_roja: Array<{ jugador: string; cantidad: number }>;
    sancionados_amarilla: Array<{ jugador: string; cantidad: number }>;
  }
  

 