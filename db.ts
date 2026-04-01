import mongoose from "mongoose";
import { MONGODB_URI } from "./config";

// Cache global simplificado
let cachedConnection: typeof mongoose | null = null;
let pendingPromise: Promise<typeof mongoose> | null = null;

export const ConnectDb = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI no está definida");
  }

  // Si ya hay conexión activa, reutilizarla
  if (cachedConnection) {
    console.log("✅ MongoDB conectado (reutilizando conexión existente)");
    return cachedConnection;
  }

  // Si ya hay una promesa pendiente, esperarla
  if (!pendingPromise) {
    console.log("🔄 Estableciendo nueva conexión a MongoDB...");
    pendingPromise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });
  }

  try {
    cachedConnection = await pendingPromise;
    console.log("✅ MongoDB conectado exitosamente");
    return cachedConnection;
  } catch (error) {
    pendingPromise = null;
    cachedConnection = null;
    console.error("❌ Error al conectar a MongoDB:", error);
    throw error;
  }
};

export const disconnectDb = async () => {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    pendingPromise = null;
    console.log("🔌 Conexión a MongoDB cerrada");
  }
};