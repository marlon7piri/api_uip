import Reserva from "../models/Reserva.models";
import { Request, Response } from "express";
import ChanchaModel from "../models/Canchas.models";

export const crearReserva = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const parametros = req.body;

    const foundCancha = await ChanchaModel.findOne({
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

    console.log({ canchaId });
    const cancha = await ChanchaModel.findById(canchaId);

    if (!cancha) {
      res.json({ message: "La cancha no existe" }).status(404);
    }

    const reservas = await Reserva.find({ canchaId });

    if (!reservas) {
      res.json({ message: "No existen reservas para esta cancha" }).status(200);
    }

    res.json(reservas).status(200);
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
    const canchaId = req.params.id;

    const cancha = await ChanchaModel.findById(canchaId);

    if (!cancha) {
      res.json({ message: "La cancha no existe" }).status(404);
    }

    const reservas = await Reserva.find({ canchaId });

    if (!reservas) {
      res.json({ message: "No existen reservas para esta cancha" }).status(200);
    }

    res.json(reservas).status(200);
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
    const canchaId = req.params.id;

    const cancha = await ChanchaModel.findById(canchaId);

    if (!cancha) {
      return res.json({ message: "La cancha no existe" }).status(404);
    }

    const reservas = await Reserva.find({ canchaId });

    if (!reservas) {
      res.json({ message: "No existen reservas para esta cancha" }).status(200);
    }

    res.json(reservas).status(200);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: "An unknown error occurred" });
    }
  }
};
