import express from "express";

import { obtenerTorneos } from "../../controllers/posts.controllers";
import { isAuth } from "../../middleware/auth";

const router = express.Router();

router.get("/list", isAuth, obtenerTorneos);

export default router;
