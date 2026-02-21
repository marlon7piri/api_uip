import { GrupoDTO } from "./grupo.dto";
import { ITorneo } from "../models/Torneo.models";

export interface TorneoResponseDTO
  extends Omit<ITorneo, "grupos" | "equipos"> {
  grupos?: GrupoDTO[];
  equipos?: any[]; // si lo usas en formato liga
}
