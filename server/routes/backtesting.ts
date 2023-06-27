import { Router } from "express";
import { backtesting, taiexData } from "../controllers/backtesting.ctrl.js";
import backtestingScript from "../controllers/script.ctrl.js";

const router = Router();

// 還有body 的 request的驗證
router.route("/strategy").post(backtesting);
router.route("/taiex").get(taiexData);
router.route("/script").post(backtestingScript);


export default router;
