import { Request, Response } from 'express';
import { getBacktestingReport } from '../models/backtestingModel.js';
import { getStockData, formattedDate, getTaiexData } from '../models/stockInfo.js';
import { calculateMA } from '../models/technicalAnalysis.js';

export async function backtesting(req: Request, res: Response) {

  const { startDate, endDate, type, ma, openCondition, closeCondition } = req.body;

  const maxMa = Math.max(...ma); // 先假定一定會有大盤的ma先設定[5, 10, 20]
  const lookupStartDate = formattedDate(startDate, maxMa);
  
  const stockData = await getStockData(lookupStartDate, endDate);
  const maData = calculateMA(stockData, ma);

  
  const taiexData = await getTaiexData(lookupStartDate, endDate);
  const taiexMaData = calculateMA(taiexData, ma); // 暫定大盤景氣我設定

  const backtestingReport = await getBacktestingReport(startDate, stockData, type, maData, openCondition, closeCondition, taiexMaData);
  
  res.status(200).json(backtestingReport); 
}