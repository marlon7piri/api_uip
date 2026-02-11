export interface EquipoTorneoDTO {
  _id: string;
  nombre: string;
  estadisticasTorneo: {
    puntos: number;
    goles_favor: number;
    goles_contra: number;
    diferencia_goles: number;
    asistencias: number;
    partidos_jugados: number;
    partidos_ganados: number;
    partidos_empatados: number;
    partidos_perdidos: number;
  };
}
