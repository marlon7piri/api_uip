import app from "./app";
import { ConnectDb } from "./database";
import dotenv from "dotenv";

// Asegúrate de cargar el archivo correcto
dotenv.config({
  path: ".env.development",
});

const PORT = process.env.PORT || 3003;

const start = async () => {
  try {
    await ConnectDb();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

start();
