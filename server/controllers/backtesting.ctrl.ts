import { Request, Response } from 'express';
import { getBacktestingReport } from '../models/backtestingModel.js';
import { getStockData, getTaiexData } from '../models/stockInfo.js';
import dayjs from 'dayjs';

export async function backtesting(req: Request, res: Response) {

try {
    const { startDate, endDate, stockId, type, openCondition, closeCondition } = req.body;

    const stockData = await getStockData(startDate, endDate, stockId);
    const taiexData = await getTaiexData(startDate, endDate);
  
    const backtestingReport = await getBacktestingReport(startDate, stockData, type, openCondition, closeCondition, taiexData);
    
    res.status(200).json({backtestingReport}); 
  
} catch (err) {
  if (err instanceof Error) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.status(500).json({ error: "Something wrong" });

}}

export async function taiexData(req: Request, res: Response) {
  const startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
  const endDate = dayjs().format('YYYY-MM-DD');

  const taiexData = await getTaiexData(startDate, endDate);

  res.status(200).json({taiexData});
}
