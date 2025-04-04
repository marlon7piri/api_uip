import jwt from "jsonwebtoken";
import Tokens from "../models/Tokens.models";
import { Request, Response } from "express";

const isAuth = async (req: Request, res: Response, next: any) => {
  // Obtenemos el token desde el encabezado 'Authorization' o 'token'
  const token = req.headers['authorization']?.split(' ')[1] || req.headers['token']?.toString();

  if (!token) {
    return res.status(403).send({
      status: "ACCESS_DENIED",
      message: "Missing header token",
    });
  }

  try {
    // Verificar el token en la base de datos si está activo
    const dataToken = await Tokens.findOne({ token });

    if (!dataToken || !dataToken.active) {
      return res.status(403).send({
        status: "ACCESS_DENIED",
        message: "Expired or invalid token",
      });
    }

    // Verificar el token usando JWT
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          status: "ACCESS_DENIED",
          message: "Invalid or expired token",
        });
      }

      // Continuamos con la ejecución de la solicitud
      req.user = decoded;  // Puedes agregar el usuario decodificado al request si es necesario
      next();
    });
  } catch (e) {
    // Si hay algún error al intentar validar el token, desactivamos el token en la base de datos
    await Tokens.findOneAndUpdate({ token }, { active: false });

    return res.status(500).send({
      status: "ERROR",
      message: "Internal server error",
    });
  }
};

export { isAuth };
