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
  keyGenerator: (req) => {
    // fallback seguro en caso de que req.ip sea undefined
    const ip =
      req.ip ||
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      "unknown";
    return ip;
  },
  handler: (_req, res) => {
    return res.status(429).json({
      message: "Demasiadas peticiones, intenta más tarde.",
    });
  },
  legacyHeaders: false, // Desactiva X-RateLimit-* headers antiguos
  standardHeaders: true, // Usa headers estándar
});

app.use(limiter);
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

Routes(app);

export default app;
