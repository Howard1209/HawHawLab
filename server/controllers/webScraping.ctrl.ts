import { Request, Response } from "express";
import * as webScrapingModel from "../models/webScrapingModel.js"
import dayjs from 'dayjs';

export async function webScraping(req:Request, res: Response) {
  try {    
    const dayOfWeek = dayjs().day();
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      throw new Error("It's not weekday!")
    }
    const { id } = req.body;
    if (id !== process.env.AWS_PASSWORD) {
      throw new Error("You are so bad!")
    }
    const todayForTaiex = dayjs().format('YYYYMMDD');
    await webScrapingModel.taiexScraping(todayForTaiex)

    const todayForStock = dayjs().format('YYYY-MM-DD')
    const previousDayFotStock = dayjs().subtract( 1 , 'day').format('YYYY-MM-DD');    
    await webScrapingModel.stockScraping(previousDayFotStock, todayForStock);
    
    res.status(200).json('Success');
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({error: err.message});
      return;
    }
    res.status(500).json({ errors: "Something is wrong" });
  }
}
