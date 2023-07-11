import { Request, Response } from 'express';
import { getBacktestingReport } from '../models/backtestingModel.js';
import { getStockData, getTaiexData } from '../models/stockInfo.js';
import { calculateMA, getKD, fixCalculateMA } from '../models/technicalAnalysis.js';
import dayjs from 'dayjs';

export async function backtesting(req: Request, res: Response) {

try {
    const { startDate, endDate, stockId, type, ma, openCondition, closeCondition } = req.body;
    const maxMa = Math.max(...ma);
  
    const stockData = await getStockData(startDate, endDate, stockId, maxMa);
    const maData = calculateMA(stockData, ma, startDate);
  
    const adjStockDate = stockData.filter((obj) => obj.date >= startDate).map((ele,index) => {
      return { ...ele, ma5: maData[5][index], ma10: maData[10][index], ma20: maData[20][index]};
    });
    const kdArr = (openCondition.method === 'kd' || closeCondition.method === 'kd') ? getKD(stockData) : [];
    const taiexData = await getTaiexData(startDate, endDate, maxMa);
    const taiexMaData = calculateMA(taiexData, ma, startDate); // 暫定大盤景氣我設定  
  
    const backtestingReport = await getBacktestingReport(startDate, adjStockDate, type, openCondition, closeCondition, taiexMaData, kdArr);
    
    res.status(200).json(backtestingReport); 
  
} catch (err) {
  if (err instanceof Error) {
    res.status(400).json({ errors: err.message });
    return;
  }
  res.status(500).json({ errors: "Something wrong" });

}}

export async function taiexData(req: Request, res: Response) {
  const ma = [5, 10, 20];
  const maxMa = Math.max(...ma); 
  const startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD');
  const endDate = dayjs().format('YYYY-MM-DD');

  const taiexData = await getTaiexData(startDate, endDate, maxMa);
  const taiexMaData = fixCalculateMA(taiexData).filter((obj) => obj.date >= startDate);  
  
  const adjTaiexData =  taiexData.filter((obj) => obj.date >= startDate).map((ele,index) => {
    const { date, ...rest } = ele;
    return { ...rest, ...taiexMaData[index]};
  });
  console.log(adjTaiexData);
  
  res.status(200).json({adjTaiexData});
}
