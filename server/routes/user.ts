import { Router, Response, Request } from "express";
import { body } from "express-validator";
import { signUp, signIn, getProfile } from "../controllers/user.ctrl.js"
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

export default router;