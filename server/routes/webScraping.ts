import { Router } from "express";
import { webScraping } from "../controllers/webScraping.ctrl.js"

const router = Router();

router.route("/webScraping").post(webScraping);

export default router;