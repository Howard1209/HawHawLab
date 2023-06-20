import { Router } from "express";
import { backtesting, taiexData } from "../controllers/backtesting.ctrl.js"

const router = Router();

// 還有body 的 request的驗證
router.route("/strategy").post(backtesting);
router.route("/taiex").get(taiexData);


export default router;
