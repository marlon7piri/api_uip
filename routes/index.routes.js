import users from "./v1/user.routes"
import torneos from "./v1/torneos.routes"
import equipos from "./v1/equipos.routes"
import jugadores from "./v1/jugador.routes"
import ofertas from "./v1/ofertas.routes"
import matcher from "./v1/matcher.routes"

export  default (app) => {
  app.use("/api/v1/users", users);
  app.use("/api/v1/torneos", torneos);
  app.use("/api/v1/equipos", equipos);
  app.use("/api/v1/jugadores", jugadores);
  app.use("/api/v1/ofertas", ofertas);
  app.use("/api/v1/matcher", matcher);
};