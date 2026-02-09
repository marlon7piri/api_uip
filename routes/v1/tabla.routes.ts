import { Router } from "express";
import { TablaController } from "../../controllers/tabla.controller";

const router = Router();

router.get("/tabla/liga/:torneoId", TablaController.liga);
router.get("/tabla/grupo/:torneoId/:grupo", TablaController.grupo);

export default router;
