import { Request, Response } from 'express';
import * as stock from '../models/stockModel.js'
import { calculateMovingAverages } from '../models/technicalAnalysis.js';


export async function getStockList(req: Request, res: Response) {
  const data = await stock.getStockList()
  res.status(200).json({data});
}

export async function getStockDetail(req: Request, res: Response) {
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
}

