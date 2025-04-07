import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log(req.headers); // nota: es `headers`, no `header`

  // Aquí podrías hacer validaciones con tokens, sesiones, etc.

  next();
};