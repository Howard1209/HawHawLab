import { Router, Response, Request } from "express";
import { body } from "express-validator";
import { signUp, signIn } from "../controllers/user.ctrl.js"
import * as validator from "../middleware/validator.js";

const router = Router();

router
  .route("/user/signup")
  .post([
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('name', 'Name is required').exists().notEmpty().trim(),
    body('password','Password must be 6 or more characters').exists().notEmpty(),
    validator.handleResult,
    signUp,
  ]);

router.route("/user/signin").post([
  body("email", 'Please include a valid email').isEmail().normalizeEmail(),
  body('password','Password must be 6 or more characters').exists().notEmpty(),
  validator.handleResult,
  signIn,
]);

export default router;