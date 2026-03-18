import { Router } from "express";
import { confirmResetPassword, create, forgotPassword, login, logout } from "../../controllers/users.controller";
import { isAuth } from "../../middleware/auth";

const userRouter = Router();

userRouter.post("/create", create);
userRouter.get("/logout", isAuth, logout);
userRouter.post("/login", login);


// ... tus otras rutas
userRouter.post("/forgot-password", forgotPassword); // El usuario pide recuperar
userRouter.post("/confirm-reset", confirmResetPassword); // El usuario envía la nueva clave con el token



export default userRouter;
