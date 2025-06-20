import User, { IUser } from "models/User.models";
import { Request, Response, NextFunction } from "express";

export const findPlanMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Asegúrate de que el usuario esté presente en el request
    const userId = req.user?.userid;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;  // Aquí terminamos la ejecución del middleware.
    }

    const user: IUser | null = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;  // Aquí también terminamos la ejecución del middleware.
    }
    if (user.plan === "free") {
      res.status(403).json({ message: "Su plan no le permite crear torneos" });
      return;  // Aquí terminamos la ejecución del middleware.
    }

    next();  // Si todo está bien, pasamos al siguiente middleware.
  } catch (error) {
    console.error("Error en findPlanMiddleware:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
