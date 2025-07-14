import { Express } from "express";
import users from "./v1/user.routes";
import torneos from "./v1/torneos.routes";
import equipos from "./v1/equipos.routes";
import jugadores from "./v1/jugador.routes";
import ofertas from "./v1/ofertas.routes";
import noticias from "./v1/noticias.routes";
import matcher from "./v1/matcher.routes";
import posts from "./v1/posts.routes";
import cancha from "./v1/cancha.routes";
import reserva from "./v1/reserva.routes";
import upload from "./v1/upload.routes";
import checkout from "./v1/checkout.routes";

export default (app: Express) => {
  app.use("/api/v1/users", users);
  app.use("/api/v1/torneos", torneos);
  app.use("/api/v1/equipos", equipos);
  app.use("/api/v1/jugadores", jugadores);
  app.use("/api/v1/ofertas", ofertas);
  app.use("/api/v1/noticias", noticias);
  app.use("/api/v1/matcher", matcher);
  app.use("/api/v1/posts", posts);
  app.use("/api/v1/cancha", cancha);
  app.use("/api/v1/reserva", reserva);
  app.use("/api/v1/upload", upload);
  app.use("/api/v1/checkout", checkout);
};
