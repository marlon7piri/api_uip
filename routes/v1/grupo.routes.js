import express from "express";

import {
  createGrupo,
  getGrupos,
  getGrupoById,
} from "../../controllers/grupo.controllers.js";
import { isAuth } from "../../middleware/auth.js";

const router = express.Router();

router.post("/create", isAuth, createGrupo);
router.get("/list", isAuth, getGrupos);
router.get("/list/:id", isAuth, getGrupoById);

export default router;
