import users from "./v1/user.routes.js";
import torneos from "./v1/torneos.routes.js";
import grupos from "./v1/grupo.routes.js";
import equipos from "./v1/equipos.routes.js";
import jugadores from "./v1/jugador.routes.js";
import ofertas from "./v1/ofertas.routes.js";
import noticias from "./v1/noticias.routes.js";
import matcher from "./v1/matcher.routes.js";
import upload from "./v1/upload.routes.js";

export default (app) => {
  app.use("/api/v1/users", users);
  app.use("/api/v1/torneos", torneos);
  app.use("/api/v1/grupo", grupos);
  app.use("/api/v1/equipos", equipos);
  app.use("/api/v1/jugadores", jugadores);
  app.use("/api/v1/ofertas", ofertas);
  app.use("/api/v1/noticias", noticias);
  app.use("/api/v1/matcher", matcher);
  app.use("/api/v1/upload", upload);
};
