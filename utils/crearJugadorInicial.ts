import Jugador from "models/Jugador.models";
import { Types } from "mongoose";

export const crearJugadorInicial = async (data: any) => {

  try {

    console.log({data})
    const jugador = new Jugador({
      nombre: data.nombre,
      edad: 18,
      estatura: 170,
      foto: process.env.URL_FOTO_AGENTE_LIBRE,
      estadisticasGlobales: {
        posicion: "Centro Campista",
      },

      rol: data.clasificacion ? data.clasificacion : 'jugador',
      userId: data?.userId?.toString(),
      club: new Types.ObjectId(process.env.ID_EQUIPO_AGENTE_LIBRE),
    });

    const jugadoSaved = await jugador.save();

    if (jugadoSaved) {
      return jugadoSaved;
    }
  } catch (error) {
    throw new Error("Error creando el jugador");
  }
};
