import { Router } from "express";
import { webScraping } from "../controllers/webScraping.ctrl.js"

const router = Router();

router.route("/webScraping").post(webScraping);

// router.route("/stockScraping").post(stockScraping);

export default router;