import JugadorModels from "../models/Jugador.models";
import Torneo, { IOTorneo } from "../models/Torneo.models";
import mongoose from "mongoose";

export const goleadoresTorneo = async (idTorneo: IOTorneo, idGoleadores: string[]) => {
  const torneo = await Torneo.findById(idTorneo);

  if (!torneo) {
    throw new Error(`Torneo ${idTorneo} no encontrado`);
  }

  //Contar cuantas goles anoto cada jugador

  let conteoGoles = {};

  for (const goleador of idGoleadores) {
    conteoGoles[goleador] = (conteoGoles[goleador] || 0) + 1;
  }

  //Buscar y actualizar cada asistente del torneo

  for (const [idJugador, cantidad] of Object.entries(conteoGoles)) {
    //Actualizar estadisticasGlobales del jugador

    const jugador = await JugadorModels.findById(idJugador);

    if (!jugador) {
      throw new Error(`Jugador con id:${idJugador} no se encontro`);
    }
    if (typeof (cantidad) == 'number') {
      jugador.estadisticasGlobales.goles += cantidad;
      await jugador.save();

      //Actualizar estadisticas del torneo del jugador

      const jugadorExist = torneo.goleadores.find(
        (g) => g.jugador.toString() == idJugador
      );

      if (jugadorExist) {
        jugadorExist.cantidad += cantidad;
      } else {
        torneo.goleadores.push({
          jugador: new mongoose.Types.ObjectId(idJugador),
          cantidad,
        });
      }
    } else {
      console.warn('cantidad no es un número:', cantidad);
    }



  }

  await torneo.save();
};

export const asistentesTorneo = async (idTorneo: IOTorneo, idAsistentes: string[]) => {
  const torneo = await Torneo.findById(idTorneo);

  if (!torneo) {
    throw new Error(`No se encontro el torneo con id ${idTorneo}`);
  }

  let conteoAsistencias = {};

  //Contar cuantas asistencias dio cada asistente
  for (const asistente of idAsistentes) {
    conteoAsistencias[asistente] = (conteoAsistencias[asistente] || 0) + 1;
  }

  //Buscar y actualizar cada asistente del torneo

  for (const [idAsistente, cantidad] of Object.entries(conteoAsistencias)) {
    //Actualizar estadisticasGlobales del jugador
    const jugador = await JugadorModels.findById(idAsistente);

    if (!jugador) {
      throw new Error(`Jugador con id:${idAsistente} no se encontro`);
    }

    if(typeof(cantidad) == 'number'){
      jugador.estadisticasGlobales.asistencias += cantidad;

      await jugador.save();
  
      //Actualizar estadisticas del torneo del jugador
      const existAsistente = torneo.asistentes.find(
        (a) => a.jugador.toString() === idAsistente
      );
  
      if (existAsistente) {
        existAsistente.cantidad += cantidad;
      } else {
        torneo.asistentes.push({
          jugador: new mongoose.Types.ObjectId(idAsistente),
          cantidad,
        });
      }
    }

    
  }

  await torneo.save();
};
export const amarillasTorneo = async (idTorneo: IOTorneo, idAmarillas: string[]) => {
  const torneo = await Torneo.findById(idTorneo);

  if (!torneo) {
    throw new Error(`No se encontro el torneo con id ${idTorneo}`);
  }

  let conteoAmarillas = {};

  //Contar cuantas asistencias dio cada asistente
  for (const amarillas of idAmarillas) {
    conteoAmarillas[amarillas] = (conteoAmarillas[amarillas] || 0) + 1;
  }

  //Buscar y actualizar cada asistente del torneo

  for (const [idAmarillas, cantidad] of Object.entries(conteoAmarillas)) {
    //Actualizar estadisticasGlobales del jugador
    const jugador = await JugadorModels.findById(idAmarillas);

    if (!jugador) {
      throw new Error(`Jugador con id:${idAmarillas} no se encontro`);
    }

    if(typeof(cantidad) == 'number'){
      jugador.estadisticasGlobales.tarjetas_amarillas += cantidad;

      await jugador.save();
  
      //Actualizar estadisticas del torneo del jugador
      const existAmarilla = torneo.sancionados_amarilla.find(
        (a) => a.jugador.toString() === idAmarillas
      );
  
      if (existAmarilla) {
        existAmarilla.cantidad += cantidad;
      } else {
        torneo.sancionados_amarilla.push({
          jugador: new mongoose.Types.ObjectId(idAmarillas),
          cantidad,
        });
      }
    }

   
  }

  await torneo.save();
};
export const rojasTorneo = async (idTorneo: IOTorneo, idRojas: string[]) => {
  const torneo = await Torneo.findById(idTorneo);

  if (!torneo) {
    throw new Error(`No se encontro el torneo con id ${idTorneo}`);
  }

  let conteoRojas = {};

  //Contar cuantas asistencias dio cada asistente
  for (const rojas of idRojas) {
    conteoRojas[rojas] = (conteoRojas[rojas] || 0) + 1;
  }

  //Buscar y actualizar cada asistente del torneo

  for (const [idRojas, cantidad] of Object.entries(conteoRojas)) {
    //Actualizar estadisticasGlobales del jugador
    const jugador = await JugadorModels.findById(idRojas);

    if (!jugador) {
      throw new Error(`Jugador con id:${idRojas} no se encontro`);
    }

    if (typeof (cantidad) == 'number') {

      jugador.estadisticasGlobales.tarjetas_rojas += cantidad;

      await jugador.save();

      //Actualizar estadisticas del torneo del jugador
      const existRoja = torneo.sancionados_roja.find(
        (a) => a.jugador.toString() === idRojas
      );

      if (existRoja) {
        existRoja.cantidad += cantidad;
      } else {
        torneo.sancionados_roja.push({
          jugador: new mongoose.Types.ObjectId(idRojas),
          cantidad,
        });
      }
    } else {
      console.warn("cantidad no es un numero", cantidad)
    }


  }

  await torneo.save();
};
