import { Router } from "express";
import { backtesting, taiexData } from "../controllers/backtesting.ctrl.js";
import backtestingScript from "../controllers/script.ctrl.js";
import formValidator from "../middleware/formValidator.js"
import {getStockList, getStockDetail} from "../controllers/stock.ctrl.js"
import { body } from "express-validator";
import * as validator from "../middleware/validator.js";

const router = Router();

router.route("/strategy").post([
  body('startDate').exists().notEmpty(),
  body('endDate').exists().notEmpty(),
  validator.handleResult,
  formValidator,
  backtesting
]);
router.route("/taiex").get(taiexData);
router.route("/script").post(backtestingScript);

router.route("/stockList").get(getStockList);
router.route("/stockDetail/:stockId").get(getStockDetail);


export default router;
