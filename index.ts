import app from "./app";
import { ConnectDb } from "./database";
import { PORT } from "./config";

ConnectDb().then(() => {
  const port = PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${port}`);
  });
});
