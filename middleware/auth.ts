import jwt, { JwtPayload } from "jsonwebtoken";
import Tokens from "../models/Tokens.models";
import { NextFunction, Request, Response } from "express";

// Extendemos la interfaz de Request para que TypeScript no de error con req.user
declare global {
  namespace Express {
    interface Request {
      user?: { _id: string } & JwtPayload;
    }
  }
}

const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // 1. Extraer el token de múltiples fuentes (Authorization Bearer o header 'token')
  const token =
    req.headers["authorization"]?.split(" ")[1] ||
    req.headers["token"]?.toString();

  if (!token) {
    res.status(403).send({
      status: "ACCESS_DENIED",
      message: "Missing header token",
    });
    return;
  }

  try {
    // 2. Validar contra la base de datos (Lista blanca de tokens activos)
    const dataToken = await Tokens.findOne({ token });

    if (!dataToken || !dataToken.active) {
      res.status(401).send({ // Usamos 401 para falta de auth, 403 es para falta de permisos
        status: "ACCESS_DENIED",
        message: "Expired or invalid token",
      });
      return;
    }

    // 3. Verificar el JWT (Usamos la versión síncrona dentro del try/catch para mayor limpieza)
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // 4. Inyectar los datos en el request
    // Nota: Tu login guarda { _id }, asegúrate que coincida aquí
    if (decoded && typeof decoded === "object") {
      req.user = decoded as { _id: string } & JwtPayload;
      next(); // ¡Todo bien! Pasamos al controlador
    } else {
      throw new Error("Invalid payload");
    }

  } catch (e: any) {
    // Si el token es inválido según JWT, lo desactivamos en la DB de una vez
    if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
      await Tokens.findOneAndUpdate({ token }, { active: false });
      res.status(401).send({
        status: "ACCESS_DENIED",
        message: "Token is no longer valid",
      });
      return;
    }

    console.error("Auth Middleware Error:", e);
    res.status(500).send({
      status: "ERROR",
      message: "Internal server error",
    });
  }
};

export { isAuth };