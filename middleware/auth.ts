import jwt, { JwtPayload } from "jsonwebtoken";
import Tokens from "../models/Tokens.models";
import { NextFunction, Request, Response } from "express";

const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const dataToken = await Tokens.findOne({ token });

    if (!dataToken || !dataToken.active) {
      res.status(403).send({
        status: "ACCESS_DENIED",
        message: "Expired or invalid token",
      });
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        res.status(403).send({
          status: "ACCESS_DENIED",
          message: "Invalid or expired token",
        });
        return;
      }

      // ✅ Verificamos que decoded sea un objeto y no un string
      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "userid" in decoded
      ) {
        req.user = decoded as { userid: string } & JwtPayload;
      } else {
        throw new Error("Token inválido o malformado");
      }
      next();
    });
  } catch (e) {
    await Tokens.findOneAndUpdate({ token }, { active: false });

    res.status(500).send({
      status: "ERROR",
      message: "Internal server error",
    });
  }
};

export { isAuth };
