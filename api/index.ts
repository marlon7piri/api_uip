import app from "../app";
import serverless from "serverless-http";
import { ConnectDb } from "../database";

let isConnected = false;

const connectOnce = async () => {
  if (!isConnected) {
    await ConnectDb();
    isConnected = true;
  }
};

// Inicializa solo una vez
const handler = serverless(app);

export default async function mainHandler(req: any, res: any) {
  await connectOnce();
  return handler(req, res); // Reutiliza el mismo handler
}
