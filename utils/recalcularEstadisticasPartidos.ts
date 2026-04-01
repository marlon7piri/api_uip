import Jugador from "../models/Jugador.models";
import Partido from "../models/partido.models";
import mongoose from "mongoose";


export const recalcularEstadisticasDesdePartidos = async (jugadorId: string | mongoose.Types.ObjectId) => {
  try {
    const id = new mongoose.Types.ObjectId(jugadorId);

    const stats = await Partido.aggregate([
      // 1. Filtramos solo los partidos donde el jugador tiene al menos un evento
      { $match: { "eventos.jugador": id } },
      
      // 2. "Desglosamos" el array de eventos para tratar cada uno individualmente
      { $unwind: "$eventos" },
      
      // 3. Filtramos los eventos que pertenecen específicamente a este jugador
      { $match: { "eventos.jugador": id } },
      
      // 4. Agrupamos y contamos por tipo
      {
        $group: {
          _id: "$eventos.jugador",
          goles: { 
            $sum: { $cond: [{ $eq: ["$eventos.tipo", "gol"] }, 1, 0] } 
          },
          amarillas: { 
            $sum: { $cond: [{ $eq: ["$eventos.tipo", "amarilla"] }, 1, 0] } 
          },
          rojas: { 
            $sum: { $cond: [{ $eq: ["$eventos.tipo", "roja"] }, 1, 0] } 
          }
        }
      }
    ]);

    const nuevosDatos = stats[0] || { goles: 0, amarillas: 0, rojas: 0 };

    // 5. Actualizamos el perfil del jugador
    await Jugador.findByIdAndUpdate(id, {
      $set: {
        "estadisticasGlobales.goles": nuevosDatos.goles,
        "estadisticasGlobales.tarjetas_amarillas": nuevosDatos.amarillas,
        "estadisticasGlobales.tarjetas_rojas": nuevosDatos.rojas,
      }
    });

  } catch (error) {
    console.error("Error al recalcular stats del jugador:", error);
  }
};