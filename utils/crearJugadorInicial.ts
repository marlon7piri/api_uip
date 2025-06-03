import Jugador from "models/Jugador.models";
import { Types } from "mongoose";

export const crearJugadorInicial = async (data: any) => {

    try {

        console.log(process.env.URL_FOTO_AGENTE_LIBRE)
        console.log(process.env.ID_EQUIPO_AGENTE_LIBRE)
        const jugador = new Jugador({
            nombre: data.nombre,
            apellido: data.apellido,
            edad: 18,
            estatura: 170,
            foto: process.env.URL_FOTO_AGENTE_LIBRE,
            estadisticasGlobales: {
                posicion: "Centro Campista",
            },

            rol: data.clasificacion,
            email: data.email,
            estudiante: "no",
            userId: data?.userId?.toString(),
            club: new Types.ObjectId(process.env.ID_EQUIPO_AGENTE_LIBRE)
        });



        console.log({ jugador })
        const jugadoSaved = await jugador.save();

        if (jugadoSaved) {
            return true
        }

    } catch (error) {
        throw new Error("Error creando el jugador")
    }
}