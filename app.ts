import express from "express";
import http from 'http'
import Routes from "./routes/index.routes";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { CORS_ORIGIN } from "./config";
import { Server } from 'socket.io'

const app = express();
//export const server = http.createServer(app)
/* export const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, methods: ['GET', 'POST'] },

}) */

/* io.on("connection", (socket) => {

  // El usuario avisa que entró al detalle de un partido
  socket.on("join_match", (partidoId) => {
    socket.join(partidoId);
    console.log(`Usuario ${socket.id} se unió al partido: ${partidoId}`);
  });

  // El usuario sale del detalle o cierra la app
  socket.on("leave_match", (partidoId) => {
    socket.leave(partidoId);
    console.log(`Usuario ${socket.id} salió del partido: ${partidoId}`);
  });
}); */
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
