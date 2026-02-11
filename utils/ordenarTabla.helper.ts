import { EquipoTorneoDTO } from "../dtos/equipo.dto";

export function ordenarTabla(
  equipos: EquipoTorneoDTO[]
): EquipoTorneoDTO[] {
  return equipos.sort((a, b) => {
    const A = a.estadisticasTorneo;
    const B = b.estadisticasTorneo;

    if (B.puntos !== A.puntos) {
      return B.puntos - A.puntos;
    }

    if (B.diferencia_goles !== A.diferencia_goles) {
      return B.diferencia_goles - A.diferencia_goles;
    }

    if (B.goles_favor !== A.goles_favor) {
      return B.goles_favor - A.goles_favor;
    }

    return a.nombre.localeCompare(b.nombre);
  });
}
