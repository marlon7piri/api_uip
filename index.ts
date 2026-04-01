//import { server } from "./app";
import { ConnectDb } from "./database";
import { PORT } from "./config";
import app from "./app";

ConnectDb().then(() => {
  const port = PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${port}`);
  });
});
