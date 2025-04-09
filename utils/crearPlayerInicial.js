import { Types } from "mongoose";
import JugadorModels from "../models/Jugador.models.js";

// Crear un nuevo jugador
export const crearJugadorInicial = async (data) => {
    try {


        const jugador = new JugadorModels({
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
            userId: data._id,
            club: new Types.ObjectId(process.env.ID_EQUIPO_AGENTE_LIBRE)
        });


        const jugadoSaved = await jugador.save();

        if (jugadoSaved) {
            return true
        }

    } catch (error) {
        throw new Error("Error creando el jugador")
    }
};