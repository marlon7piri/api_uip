import Reserva, { ReservaDocument } from "../models/Reserva.models";
import { Request, Response } from "express";
import CanchaModel from "../models/Canchas.models";

export const crearReserva = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const parametros = req.body;


    const foundCancha = await CanchaModel.findOne({
      _id: parametros.canchaId,
    });

    if (!foundCancha) {
      return res.json({ message: "La cancha no existe" }).status(404);
    }
    const reserva = await Reserva.create({
      ...req.body,
    });

    res.json(reserva).status(201);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};

export const obtenerReservaByCanchaId = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const canchaId = req.params.id;
    console.log({canchaId})

    const cancha = await CanchaModel.findById(canchaId);
    console.log({cancha})

    if (!cancha) {
      return res.status(404).json({ message: "La cancha no existe" });
    }

    const reservas = await Reserva.find({ canchaId });

    if (!reservas) {
      return res
        .status(404)
        .json({ message: "No existen reservas para esta cancha" });
    }
console.log({reservas})
    return res.status(200).json(reservas);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};
export const confirmarReserva = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const reservaId = req.params.id;

    const reserva = await Reserva.findById(reservaId);

    if (!reserva) {
      return res.status(404).json({ message: "La reserva no existe" });
    }

    const reservaUpdated = await Reserva.findByIdAndUpdate(
      reservaId,
      {
        estado: "confirmado",
      },
      { new: true }
    );

    //Aqui se le notificara por correo al usuario que la reserva esta confirmada

    res.status(200).json(reservaUpdated);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};
export const cancelarReserva = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const reservaId = req.params.id;

    const reserva = await Reserva.findById(reservaId);

    if (!reserva) {
      return res.status(404).json({ message: "La reserva no existe" });
    }

    const reservaUpdated = await Reserva.findByIdAndUpdate<ReservaDocument>(
      reservaId,
      {
        estado: "cancelado",
      },
      { new: true }
    );

    //Aqui se le notificara por correo al usuario que la reserva esta confirmada

    res.status(200).json(reservaUpdated);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};
