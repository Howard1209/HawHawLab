import { Router } from "express";
import { backtesting } from "../controllers/backtesting.ctrl.js"

const router = Router();

// 還有body 的 request的驗證
router.route("/test").post(backtesting);


export default router;
