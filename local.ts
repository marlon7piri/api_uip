import app, { server } from "./app";
import { ConnectDb } from "./database";
import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 3003;

const start = async () => {
  try {
    await ConnectDb();
    
    // Cambiamos el orden de los parámetros para mayor claridad
    server.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🚀 Server running on http://192.168.0.8:${PORT}`); // Usa tu IP local
    });

    // Manejo de errores de cierre limpio (evita que el puerto quede ocupado)
    process.on('SIGINT', () => {
      server.close(() => {
        console.log('🛑 Server closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

start();
