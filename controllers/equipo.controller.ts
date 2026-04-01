import { Request, Response } from "express";
import { EquipoService } from "../services/equipo.service";
import mongoose from "mongoose";
import Equipo from "models/Equipo.models";

export class EquipoController {
  static async crear(req: Request, res: Response) {
    try {
      console.log({ req })
      const equipo = await EquipoService.crearEquipo({
        ...req.body,
        autorId: req.user.userid,
      });


      res.status(201).json(equipo);
    } catch (error) {
      res.status(500).json({ message: "Error al crear equipo" });
    }
  }

  static async listar(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = (req.query.search as string) || "";

      
      const equipos = await EquipoService.obtenerEquipos({
        page,
        limit,
        search,
      });

      res.json(equipos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener equipos" });
    }
  }

  static async obtenerDetalle(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;

    const equipoDetalle = await EquipoService.getEquipoDetalle(id);

    if (!equipoDetalle) {
      return res.status(404).json({ 
        status: "error", 
        message: "Equipo no encontrado o ID no válido" 
      });
    }

    res.json({
      status: "success",
      data: equipoDetalle
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      status: "error", 
      message: "Error al obtener el detalle del equipo" 
    });
  }
}

  static async actualizar(req: Request, res: Response) {
    const equipo = await EquipoService.actualizarEquipo(
      req.params.id,
      req.body
    );
    res.json(equipo);
  }

  static async eliminar(req: Request, res: Response) {
    await EquipoService.eliminarEquipo(req.params.id);
    res.json({ message: "Equipo eliminado" });
  }



}
