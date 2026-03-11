import Equipo, { IEquipo } from "../models/Equipo.models";
import mongoose from "mongoose";

export class EquipoService {
  static async crearEquipo(data: Partial<IEquipo>) {
    return Equipo.create(data);
  }

  static async obtenerEquipos({
    page = 1,
    limit = 20,
    search = "",
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (search) {
      filter.nombre = {
        $regex: search,
        $options: "i", // case insensitive
      };
    }

    const [data, total] = await Promise.all([
      Equipo.find(filter)
        .sort({ nombre: 1 })
        .skip(skip)
        .limit(limit),
      Equipo.countDocuments(filter),
    ]);

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    };
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
