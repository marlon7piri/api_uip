import { Express } from "express";
import users from "./v1/user.routes";
import torneos from "./v1/torneo.routes";
import equipos from "./v1/equipos.routes";
import jugadores from "./v1/jugador.routes";
import matcher from "./v1/partido.routes";
import cancha from "./v1/cancha.routes";
import checkout from "./v1/checkout.routes";
import { isAuth } from "middleware/auth";

export default (app: Express) => {
  app.use("/api/v1/users", users);
  app.use("/api/v1/torneos",isAuth, torneos);
  app.use("/api/v1/equipos",isAuth, equipos);
  app.use("/api/v1/jugadores",isAuth, jugadores);
  app.use("/api/v1/partidos",isAuth, matcher);
  app.use("/api/v1/cancha",isAuth, cancha);
  app.use("/api/v1/checkout",isAuth, checkout);
};
