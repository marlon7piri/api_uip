// utils/ordenarTabla.helper.ts

export const ordenarTabla = (equipos: any[]) => {
  return equipos.sort((a, b) => {
    if (b.estadisticasTorneo.puntos !== a.estadisticasTorneo.puntos) {
      return b.estadisticasTorneo.puntos - a.estadisticasTorneo.puntos;
    }

    if (
      b.estadisticasTorneo.diferencia_goles !==
      a.estadisticasTorneo.diferencia_goles
    ) {
      return (
        b.estadisticasTorneo.diferencia_goles -
        a.estadisticasTorneo.diferencia_goles
      );
    }

    return (
      b.estadisticasTorneo.goles_favor -
      a.estadisticasTorneo.goles_favor
    );
  });
};