import { Types } from "mongoose";
import JugadorModels from "../models/Jugador.models.js";

// Crear un nuevo jugador
export const crearJugadorInicial = async (data) => {
    try {

       
        const jugador = new JugadorModels({
            nombre: data.nombre,
            apellido: data.apellido,
            edad: 18,
            estatura: 0,
            foto: "https://res.cloudinary.com/dxi9fwjsu/image/upload/v1744040955/jugadores/kbcet5xmgcirtocjrabg.png",
            rol: data.clasificacion,
            email: data.email,
            estudiante: "no",
            userId: data._id,
            club:new Types.ObjectId("67f53b97cade4a2fd9c8ff47")
        });

       
        const jugadoSaved = await jugador.save();

        if (jugadoSaved) {
            return true
        }

    } catch (error) {
        throw new Error("Error creando el jugador")
    }
};