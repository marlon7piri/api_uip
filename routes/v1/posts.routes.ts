import express from "express";

import { obtenerPosts, obtenerPost } from "../../controllers/posts.controllers";
import { isAuth } from "../../middleware/auth";

const router = express.Router();

router.get("/list", isAuth, obtenerPosts);
router.get("/:id", isAuth, obtenerPost);

export default router;
