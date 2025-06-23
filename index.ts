import app from "./app.js";
import { PORT } from "./config.js";
import { ConnectDb } from "./database";

const main = async () => {
  await ConnectDb();
};

main();
