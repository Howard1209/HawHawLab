import { Request, Response, NextFunction } from "express";
import verifyJWT from "../util/verifyJWT.js";

async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const tokenInHeaders = req.get("Authorization");
    const token =
      tokenInHeaders?.replace("Bearer ", "") || req.cookies.jwtToken;
    if (!token) {
      res.status(401).json({ error: "invalid token" });
      return;
    }
    const decoded = await verifyJWT(token);
    res.locals.userId = decoded.userId;
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ error: err.message });
      return;
    }
    res.status(401).json({ error: "authenticate failed" });
  }
}

export default authenticate;
