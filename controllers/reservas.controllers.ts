import Reserva from "../models/Reserva.models"
import {Request,Response} from "express"
import ChanchaModel from "../models/Canchas.models"

export const crearReserva = async (req:Request,res:Response):Promise<any>=>{

    try {
        const {canchaId,userId} = req.body

        const foundCancha = await ChanchaModel.findById(canchaId)

        if(!foundCancha){
            return res.json({message:'La cancha no existe'}).status(404)
        }
        const reserva = await Reserva.create({
            ...req.body
        })

        return res.json(reserva).status(201)
    } catch (error:unknown) {

        if(error instanceof Error){
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
        
    }

}


export const obtenerReservaByCanchaId = async(req:Request,res:Response)=>{
    try {
        const canchaId=  req.params.id
        const cancha = await ChanchaModel.findById(canchaId)

         if(!cancha){
            return res.json({message:'La cancha no existe'}).status(404)
        }

        const reservas = await Reserva.find({canchaId})

        if(!reservas){
            return res.json({message:"No existen reservas para esta cancha"}).status(200)
        }

        return res.json(reservas).status(200)
        
    } catch (error:unknown) {
        if(error instanceof Error){
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
        
    }

}