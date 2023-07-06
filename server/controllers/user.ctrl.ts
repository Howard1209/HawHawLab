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

export async function getProfile(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    const user = await userModel.findUserById(userId);
    res.status(200).json({ data: user });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: "get profile failed" });
  }
}

export async function saveStrategy(req: Request, res: Response) {
  try {
    const {id, title, code, report} = req.body;    
    
    await userModel.createStrategy(
      id, title, code, report.successRate|0, report.totalProfit|0, report.maximumLoss|0, report.maximumProfit|0
    );
    res.status(200).json('Save strategy success');
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: "Save strategy failed" });
  }
}

export async function getStrategy(req: Request, res: Response) {
  try {    
    const {userId} = req.body;
    const strategy = await userModel.getStrategy(userId);      
    res.status(200).json({strategy});
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: "Save strategy failed" });
  }
}

export async function deleteStrategy(req: Request, res: Response) {
  const { id } = req.body;
  await userModel.deleteStrategy(id);
  res.status(200).json({message:'delete Success'});
}