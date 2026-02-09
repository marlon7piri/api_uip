import { Request, Response } from "express";
import { TablaService } from "../services/tabla.service";

export class TablaController {

  static async liga(req: Request, res: Response) {
    const { torneoId } = req.params;
    const tabla = await TablaService.obtenerTablaLiga(torneoId);
    res.json(tabla);
  }

  static async grupo(req: Request, res: Response) {
    const { torneoId, grupo } = req.params;
    const tabla = await TablaService.obtenerTablaGrupo(torneoId, grupo);
    res.json(tabla);
  }
}
