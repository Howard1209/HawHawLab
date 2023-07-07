import { Router } from "express";
import {taiexScraping, event} from "../controllers/webScraping.ctrl.js"

const router = Router();

router.route("/taiexScraping").post(taiexScraping);
router.route("/event").get(event)

export default router;