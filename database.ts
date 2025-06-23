import mongoose from "mongoose";
import { MONGODB_URI } from "./config";

export const ConnectDb = async () => {
  if (!MONGODB_URI) throw new Error("MONGO_URI no está definida");

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB conectado");
  } catch (error) {
    console.error("❌ Error al conectar a Mongo:", error);
    throw error;
  }
};
