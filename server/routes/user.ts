import { Router, Response, Request } from "express";
import { body } from "express-validator";
import { signUp, signIn, getProfile, saveStrategy, getAllStrategy, deleteStrategy, searchStrategy, updateStrategy } from "../controllers/user.ctrl.js"
import * as validator from "../middleware/validator.js";
import authenticate from "../middleware/authenticate.js";

const router = Router();

router
  .route("/user/signup")
  .post([
    body('email').isEmail().normalizeEmail(),
    body('name').exists().notEmpty().trim(),
    body('password').exists().notEmpty(),
    validator.handleResult,
    signUp,
  ]);

router.route("/user/signin").post([
  body("email").isEmail().normalizeEmail(),
  body('password').exists().notEmpty(),
  validator.handleResult,
  signIn,
]);

router.route("/user/profile").get([authenticate, getProfile]);

router.route("/user/saveStrategy").post([
  body('title').exists().notEmpty().trim(),
  body('code').exists().notEmpty(),
  validator.handleResult,
  saveStrategy
]);

router.route("/user/getStrategyAll").post(getAllStrategy);

router.route("/user/strategy/:id").delete(deleteStrategy);

router.route("/user/strategy/:id").get(searchStrategy);

router.route("/user/strategy/:id").patch(updateStrategy);

export default router;