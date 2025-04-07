import { Types } from "mongoose";

export interface IEquipo {
    estadisticasGlobales: Estadisticas;
    _id:                Types.ObjectId;
    autorId:              string;
    nombre:               string;
    logo:                 string;
    torneos:              Torneo[];
    __v:                  number;
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

export interface Torneo {
    estadisticas: Estadisticas;
    torneoId:     Types.ObjectId;
   
}
