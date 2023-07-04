import { Request, Response } from "express";
import { z } from "zod";
import * as argon2 from "argon2";
import * as userModel from "../models/userModel.js";
import signJWT, { EXPIRE_TIME } from "../util/signJWT.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  secure: true,
  sameSite: "strict",
} as const;


export async function signUp(req:Request, res: Response) {  
  try {
    const { name, email, password } = req.body;
    const userId = await userModel.createUser(email, name, password);
    const token = await signJWT(userId);
    res
      .cookie("jwtToken", token, COOKIE_OPTIONS)
      .status(200)
      .json({
        data: {
          access_token: token,
          access_expired: EXPIRE_TIME,
          user: {
            id: userId,
            name,
            email
          },
        },
      })
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({error: err.message});
      return;
    }
    res.status(500).json({ errors: "sign up failed" });
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    const { email, password} = req.body;
    const user = await userModel.findUser(email);
    if (!user) {
      throw new Error("user not exist");
    }
    const isValidPassword = argon2.verify(user.password, password);
    if (!isValidPassword) {
      throw new Error("invalid password");
    }
    const token = await signJWT(user.id);
    res
      .cookie("jwtToken", token, COOKIE_OPTIONS)
      .status(200)
      .json({
        data: {
          access_token: token,
          access_expired: EXPIRE_TIME,
          user
        },
      });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ errors: err.message });
      return;
    }
    res.status(500).json({ errors: "sign in failed" });
  }
}