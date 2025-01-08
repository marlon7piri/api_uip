import  JugadorModels  from "../models/Jugador.models.js"
import  Torneo  from "../models/Torneo.models.js"
import  mongoose  from 'mongoose'

export const goleadoresTorneo = async (idTorneo, idGoleadores) => {

    const torneo = await Torneo.findById(idTorneo)


    if (!torneo) {
        throw new Error(`Torneo ${idTorneo} no encontrado`)
    }



    //Contar cuantas goles anoto cada jugador

    let conteoGoles = {}

    for (const goleador of idGoleadores) {


        conteoGoles[goleador] = (conteoGoles[goleador] || 0) + 1

    }

    //Buscar y actualizar cada asistente del torneo

    for (const [idJugador, cantidad] of Object.entries(conteoGoles)) {


        //Actualizar estadisticasGlobales del jugador

        const jugador = await JugadorModels.findById(idJugador)

        if (!jugador) {
            throw new Error(`Jugador con id:${idJugador} no se encontro`)
        }



        jugador.estadisticasGlobales.goles += cantidad

        await jugador.save()



        //Actualizar estadisticas del torneo del jugador

        const jugadorExist = torneo.goleadores.find(g => g.jugador.toString() == idJugador)

        if (jugadorExist) {
            jugadorExist.cantidad += cantidad
        } else {
            torneo.goleadores.push({
                jugador: new mongoose.Types.ObjectId(idJugador),
                cantidad
            })
        }
    }


    await torneo.save()




}


export const asistentesTorneo = async (idTorneo, idAsistentes) => {


    const torneo = await Torneo.findById(idTorneo)

    if (!torneo) {
        throw new Error(`No se encontro el torneo con id ${idTorneo}`)
    }



    let conteoAsistencias = {}

    //Contar cuantas asistencias dio cada asistente
    for (const asistente of idAsistentes) {
        conteoAsistencias[asistente] = (conteoAsistencias[asistente] || 0) + 1

    }


    //Buscar y actualizar cada asistente del torneo

    for (const [idAsistente, cantidad] of Object.entries(conteoAsistencias)) {


        //Actualizar estadisticasGlobales del jugador
        const jugador = await JugadorModels.findById(idAsistente)

        if (!jugador) {
            throw new Error(`Jugador con id:${idAsistente} no se encontro`)
        }



        jugador.estadisticasGlobales.asistencias += cantidad

        await jugador.save()




        //Actualizar estadisticas del torneo del jugador
        const existAsistente = torneo.asistentes.find(a => a.jugador.toString() === idAsistente)

        if (existAsistente) {
            existAsistente.cantidad += cantidad
        } else {
            torneo.asistentes.push({
                jugador: new mongoose.Types.ObjectId(idAsistente),
                cantidad
            })
        }

    }


    await torneo.save()





}


