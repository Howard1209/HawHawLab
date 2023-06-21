import { Request, Response } from 'express';
import { getBacktestingReport } from '../models/backtestingModel.js';
import { getStockData, formattedDate, getTaiexData } from '../models/stockInfo.js';
import { calculateMA } from '../models/technicalAnalysis.js';
import dayjs from 'dayjs';

export async function backtesting(req: Request, res: Response) {

  const { startDate, endDate, stockId, type, ma, openCondition, closeCondition } = req.body;

  const maxMa = Math.max(...ma); // 先假定一定會有大盤的ma先設定[5, 10, 20]
  const lookupStartDate = formattedDate(startDate, maxMa);
  
  const stockData = await getStockData(lookupStartDate, endDate, stockId);
  const maData = calculateMA(stockData, ma, startDate);
  
  const adjStockDate = stockData.filter((obj) => obj.date >= startDate).map((ele,index) => {
    return { ...ele, 5: maData[5][index], 10: maData[10][index], 20: maData[20][index]};
  });
  
  const taiexData = await getTaiexData(lookupStartDate, endDate);
  const taiexMaData = calculateMA(taiexData, ma, startDate); // 暫定大盤景氣我設定  

  const backtestingReport = await getBacktestingReport(startDate, adjStockDate, type, openCondition, closeCondition, taiexMaData);
  
  res.status(200).json(backtestingReport); 
}

export async function taiexData(req: Request, res: Response) {
  const ma = [5, 10, 20];
  const maxMa = Math.max(...ma); 
  const startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
  const endDate = dayjs().format('YYYY-MM-DD');
  const lookupStartDate = formattedDate(startDate, maxMa);
  
  const taiexData = await getTaiexData(lookupStartDate, endDate);
  const taiexMaData = calculateMA(taiexData, ma, startDate);  

  const adjTaiexData =  taiexData.filter((obj) => obj.date >= startDate).map((ele,index) => {
    const { date, ...rest } = ele;
    return { time: date, ...rest, 5: taiexMaData[5][index], 10: taiexMaData[10][index], 20: taiexMaData[20][index]};
  });
  
  res.status(200).json({adjTaiexData});
}
