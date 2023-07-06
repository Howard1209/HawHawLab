import { Request, Response } from "express";
import * as webScrapingModel from "../models/webScrapingModel.js"
import dayjs from 'dayjs';

export async function taiexScraping(req:Request, res: Response) {
  try {
    const { password } = req.body;
    if (password !== process.env.AWS_PASSWORD) {
    throw new Error("You are so bad!")
    }

    const now = dayjs().format('YYYYMMDD')
    await webScrapingModel.taiexScraping(now);
    res.status(200).json('Success');

  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({error: err.message});
      return;
    }
    res.status(500).json({ errors: "Something is wrong" });
  }
}
