import app from "../app";
import serverless from "serverless-http";
import { ConnectDb } from "../database";

// Asegúrate de conectar a Mongo antes de exportar el handler
let isConnected = false;

const connectOnce = async () => {
  if (!isConnected) {
    await ConnectDb();
    isConnected = true;
  }
};

const handler = async (req: any, res: any) => {
  await connectOnce();
  const server = serverless(app);
  return server(req, res);
};

export { handler };
