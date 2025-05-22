import { Types } from "mongoose";

export interface ITorneo {
    _id: Types.ObjectId;
    nombre: string;
    foto: string;
    equipos:IEquipo[];
    partidos: string[];
    autorId: string;
    goleadores: Array<{ jugador: string; cantidad: number }>;
    asistentes: Array<{ jugador: string; cantidad: number }>;
    sancionados_roja: Array<{ jugador: string; cantidad: number }>;
    sancionados_amarilla: Array<{ jugador: string; cantidad: number }>;
  }
  

 
  export interface IEquipo {
      estadisticasGlobales: Estadisticas;
      _id:                Types.ObjectId;
      autorId:              string;
      nombre:               string;
      logo:                 string;
      torneos:              Torneo[];
      __v:                  number;
  }
  

  
  export interface Torneo {
      estadisticas: Estadisticas;
      torneoId:     IEquipo;
     
  }

  export interface Estadisticas {
    goles_favor:        number;
    goles_contra:       number;
    asistencias:        number;
    partidos_jugados:   number;
    partidos_ganados:   number;
    partidos_perdidos:  number;
    partidos_empatados: number;
    puntos?:            number;
}