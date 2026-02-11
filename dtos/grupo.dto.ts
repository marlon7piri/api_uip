import { EquipoTorneoDTO } from "./equipo.dto";

export interface GrupoDTO {
  nombre: string;
  equipos: EquipoTorneoDTO[];
}
