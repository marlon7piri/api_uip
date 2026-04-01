import app from "./app";
import { ConnectDb, disconnectDb } from "./db";
import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 3003;

const start = async () => {
  try {
    // Conectar a MongoDB antes de iniciar el servidor
    await ConnectDb();
    
    // Iniciar el servidor después de tener la base de datos conectada
    const server = app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // Manejo de cierre limpio para evitar conexiones abiertas
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n⚠️ Recibida señal ${signal}, cerrando servidor...`);
      
      server.close(async () => {
        console.log('🛑 Servidor HTTP cerrado');
        
        try {
          // Cerrar la conexión a MongoDB
          await disconnectDb();
          console.log('✅ Conexiones cerradas correctamente');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error al cerrar conexiones:', error);
          process.exit(1);
        }
      });

      // Forzar cierre si tarda más de 10 segundos
      setTimeout(() => {
        console.error('⚠️ Timeout forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de terminación
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  } catch (err) {
    console.error("❌ Failed to start server:", err);
    // Si falla la conexión a DB, no iniciamos el servidor
    process.exit(1);
  }
};

start();