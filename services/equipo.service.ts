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
 static async getEquipoDetalle(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const equipoId = new mongoose.Types.ObjectId(id);

  const detalle = await Equipo.aggregate([
    { $match: { _id: equipoId } },

    // Traer jugadores
    {
      $lookup: {
        from: "jugadores", // Verifica que sea el nombre exacto en tu DB
        localField: "_id",
        foreignField: "club",
        as: "jugadores"
      }
    },

    // Traer torneos
    {
      $lookup: {
        from: "torneos",
        localField: "_id",
        foreignField: "equipos",
        as: "torneos"
      }
    },

    // Buscar partidos finalizados
    {
      $lookup: {
        from: "matchers", 
        let: { equipo_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$estado", "finalizado"] },
                  { $or: [
                    { $eq: ["$local", "$$equipo_id"] },
                    { $eq: ["$visitante", "$$equipo_id"] }
                  ]}
                ]
              }
            }
          }
        ],
        as: "partidosFinalizados"
      }
    },

    // Reducción para estadísticas
    {
      $addFields: {
        estadisticas: {
          $reduce: {
            input: "$partidosFinalizados",
            initialValue: { ganados: 0, empatados: 0, perdidos: 0, golesFavor: 0, golesContra: 0 },
            in: {
              ganados: {
                $add: ["$$value.ganados", {
                  $cond: [
                    { $or: [
                      { $and: [{ $eq: ["$$this.local", equipoId] }, { $gt: ["$$this.resultado.golesLocal", "$$this.resultado.golesVisitante"] }] },
                      { $and: [{ $eq: ["$$this.visitante", equipoId] }, { $gt: ["$$this.resultado.golesVisitante", "$$this.resultado.golesLocal"] }] }
                    ]}, 1, 0
                  ]
                }]
              },
              empatados: {
                $add: ["$$value.empatados", {
                  $cond: [{ $eq: ["$$this.resultado.golesLocal", "$$this.resultado.golesVisitante"] }, 1, 0]
                }]
              },
              perdidos: {
                $add: ["$$value.perdidos", {
                  $cond: [
                    { $or: [
                      { $and: [{ $eq: ["$$this.local", equipoId] }, { $lt: ["$$this.resultado.golesLocal", "$$this.resultado.golesVisitante"] }] },
                      { $and: [{ $eq: ["$$this.visitante", equipoId] }, { $lt: ["$$this.resultado.golesVisitante", "$$this.resultado.golesLocal"] }] }
                    ]}, 1, 0
                  ]
                }]
              },
              golesFavor: {
                $add: ["$$value.golesFavor", {
                  $cond: [{ $eq: ["$$this.local", equipoId] }, "$$this.resultado.golesLocal", "$$this.resultado.golesVisitante"]
                }]
              },
              golesContra: {
                $add: ["$$value.golesContra", {
                  $cond: [{ $eq: ["$$this.local", equipoId] }, "$$this.resultado.golesVisitante", "$$this.resultado.golesLocal"]
                }]
              }
            }
          }
        }
      }
    },

    {
      $project: {
        partidosFinalizados: 0,
        __v: 0
      }
    }
  ]);

  return detalle[0] || null;
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
