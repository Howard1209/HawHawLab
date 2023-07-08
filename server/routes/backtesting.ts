import { Router } from "express";
import { backtesting, taiexData } from "../controllers/backtesting.ctrl.js";
import backtestingScript from "../controllers/script.ctrl.js";
import formValidator from "../middleware/formValidator.js"
import { body } from "express-validator";
import * as validator from "../middleware/validator.js";


const router = Router();

// 還有body 的 request的驗證
router.route("/strategy").post([
  body('startDate').exists().notEmpty(),
  body('endDate').exists().notEmpty(),
  body('stockId').exists().notEmpty().isLength({max:4}),
  validator.handleResult,
  formValidator,
  backtesting
]);
router.route("/taiex").get(taiexData);
router.route("/script").post(backtestingScript);


export default router;
