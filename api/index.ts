import app from "../app";
import serverless from "serverless-http";
import { ConnectDb } from "../database";
import { PORT } from "config";

let isConnected = false;

const connectOnce = async () => {
  if (!isConnected) {
    await ConnectDb();
    isConnected = true;
  }
};

// Inicializa solo una vez

export default async function mainHandler(req: any, res: any) {
  await connectOnce();
  app.listen(PORT);
}
