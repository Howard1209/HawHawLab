import { Router } from "express";
import {taiexScraping} from "../controllers/webScraping.ctrl.js"

const router = Router();

router.route("/taiexScraping").post(taiexScraping);

export default router;