import { Request, Response } from "express";
import { TorneoService } from "../services/torneo.service";
import Torneo from "models/Torneo.models";

export class TorneoController {

  /* =========================
     CREAR TORNEO
  ========================= */
  static async crear(req: Request, res: Response) {
    try {
      const { fechaInicio } = req.body;

      if (!fechaInicio) {
        return res
          .status(400)
          .json({ message: 'La fecha de inicio es obligatoria' });
      }

      const torneo = await TorneoService.crearTorneo({
        ...req.body,
        autorId: req.user.userid,
      });

      return res.status(201).json(torneo);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error al crear torneo' });
    }
  }

  /* =========================
     LISTAR TORNEOS
  ========================= */
  static async listar(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        search = ""
      } = req.query;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const skip = (pageNumber - 1) * limitNumber;

      let filter: any = {};

      // 🔥 Si hay búsqueda usamos text index
      if (search) {
        filter.$text = { $search: search };
      }

      const equipos = await Torneo.find(filter)
        .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(); // 🔥 mejora rendimiento

      const total = await Torneo.countDocuments(filter);

      res.json({
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
        total,
        data: equipos
      });

    } catch (error) {
      res.status(500).json({ message: "Error obteniendo equipos", error });
    }
  };

  /* =========================
     AGREGAR EQUIPO
     (liga o grupo)
  ========================= */
  static async agregarEquipo(req: Request, res: Response) {
    try {
      const { equipoId, grupo } = req.body;
      
      const torneoActualizado = await TorneoService.agregarEquipo(
        req.params.id,
        equipoId,
        grupo // puede ser undefined si es liga
      );

      return res.json(torneoActualizado);
    } catch (error) {
      return res.status(500).json({ message: "Error del servidor" });
    }
  }

  static async equipos(req: Request, res: Response) {
    const equipos = await TorneoService.obtenerEquipos(req.params.id);
    res.json(equipos);
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {

      const torneo = await TorneoService.obtenerTorneoCompleto(req.params.id);

      res.json(torneo);
    } catch (error) {
      res.status(404).json({ message: "Torneo no encontrado" });
    }
  }

  /* =========================
     CREAR GRUPOS
  ========================= */
  static async crearGrupos(req: Request, res: Response) {
    const { cantidadGrupos } = req.body;

    await TorneoService.crearGrupos(
      req.params.id,
      cantidadGrupos
    );

    res.json({ message: "Grupos creados correctamente" });
  }


}
