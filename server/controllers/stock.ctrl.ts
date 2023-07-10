import { Request, Response } from 'express';
import * as stock from '../models/stockModel.js'
import { calculateMovingAverages } from '../models/technicalAnalysis.js';


export async function getStockList(req: Request, res: Response) {
try {
    const data = await stock.getStockList()    
    res.status(200).json({data});
} catch (err) {
  if (err instanceof Error) {
    res.status(400).json({error: err.message});
    return;
  }
  res.status(500).json({ error: "Get stock failed" });
}}

export async function getStockDetail(req: Request, res: Response) {
try {    
    const {stockId} = req.body;    
    const ma = [5, 10, 20];
    const data = await stock.getStockDetail(stockId);  
    const maData = calculateMovingAverages(data, ma);

    data.splice(0, Math.max(...ma)-1);
    
    const stockInfo = data.map((ele, index) => {
      const { date, ...rest } = ele;
      return { ...rest, ...maData[index]};
    });
    res.status(200).json({data:stockInfo});
} catch (err) {
  if (err instanceof Error) {
    res.status(400).json({error: err.message});
    return;
  }
  res.status(500).json({ error: "Get stock failed" });
}}

