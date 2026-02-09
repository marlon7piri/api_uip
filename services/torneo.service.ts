import Torneo from "../models/Torneo.models";
import Equipo from "../models/Equipo.models";

export class TorneoService {
  static async crearTorneo(data: any) {
    return Torneo.create(data);
  }

  static async listar(autorId: string) {
    return Torneo.find({ autorId }).populate("equipos partidos");
  }

  static async agregarEquipo(
    torneoId: string,
    equipoId: string,
    grupo?: string
  ) {
    await Torneo.findByIdAndUpdate(torneoId, {
      $addToSet: { equipos: equipoId },
    });

    await Equipo.updateOne(
      { _id: equipoId },
      {
        $push: {
          torneos: {
            torneoId,
            grupo,
            estadisticas: {},
          },
        },
      }
    );
  }

  static async tablaPosiciones(torneoId: string) {
    return Equipo.find(
      { "torneos.torneoId": torneoId },
      {
        nombre: 1,
        logo: 1,
        "torneos.$": 1,
      }
    ).sort({ "torneos.estadisticas.puntos": -1 });
  }
}
