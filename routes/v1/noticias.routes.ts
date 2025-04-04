import express from "express";

import {
  createNoticia,
  getNoticias,
} from "../../controllers/noticias.controllers";
import { isAuth } from "../../middleware/auth";

const router = express.Router();

router.post("/create", isAuth, createNoticia);
router.get("/list", isAuth, getNoticias);

export default router;
