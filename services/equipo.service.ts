import Equipo, { IEquipo } from "../models/Equipo.models";
import mongoose from "mongoose";

export class EquipoService {
  static async crearEquipo(data: Partial<IEquipo>) {
    return Equipo.create(data);
  }

  static async obtenerEquipos(autorId: string) {
    return Equipo.find({ autorId });
  }

  static async obtenerEquipoPorId(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Equipo.findById(id);
  }

  static async actualizarEquipo(id: string, data: Partial<IEquipo>) {
    return Equipo.findByIdAndUpdate(id, data, { new: true });
  }

  static async eliminarEquipo(id: string) {
    return Equipo.findByIdAndDelete(id);
  }


  /* =========================
     TORNEOS
  ========================= */

  static async agregarEquipoATorneo(
    torneoId: string,
    equipoId: string,
    grupo?: string
  ) {
    return Equipo.findByIdAndUpdate(
      equipoId,
      {
        $push: {
          torneos: {
            torneoId,
            grupo,
            estadisticas: {},
          },
        },
      },
      { new: true }
    );
  }
}
