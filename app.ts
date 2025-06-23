import express from "express";
import Routes from "./routes/index.routes";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { CORS_ORIGIN } from "config";

const app = express();
// Confía en el proxy de Vercel
app.set("trust proxy", 1);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 peticiones por ventana
});

app.use(limiter);
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

Routes(app);

export default app;
