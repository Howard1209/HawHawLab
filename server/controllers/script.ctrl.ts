import { Request, Response } from 'express';
import { getStockData, getTaiexData, calculateProfitLoss } from '../models/stockInfo.js';
import { calculateMovingAverages, getKD } from '../models/technicalAnalysis.js';
import { execLoopText, closeTxt } from '../util/worker.js';
import vmProcess from '../util/vm.js';

export default async function backtestingScript(req: Request, res: Response){
  try {
    const {code} = req.body;
  
    const endIndex = code.indexOf("// The trigger you want to set up, it can be empty;\n");
    const dimTxt = code.substring(0, endIndex);
    
    if (dimTxt === '') {
      throw new Error('You made changes to condition area.')
    }
    
    const {startDate, endDate, stockId, type} = vmProcess(dimTxt);
    
    if (! startDate && endDate && stockId && type) {
      throw new Error('You need to fill in the following information: startDate, endDate, stockId, ma, type.')
    }
  
    if (startDate > endDate){
      throw new Error('The start date is greater than the end date.')
    }
    
    if (type !== 'long' && type !== 'short'){
      throw new Error('The type is error')
    }
    const ma = [5, 10, 20]
    const maxMa = Math.max(...ma); 
    const stockData = await getStockData(startDate, endDate, stockId, maxMa);
    const maData = calculateMovingAverages(stockData, ma).filter((obj) => obj.date >= startDate);
  
    const stockInfo = stockData.filter((obj) => obj.date >= startDate).map((ele, index) => {
      const { date, ...rest } = ele;
      return { ...rest, ...maData[index]};
    });
  
    const taiexData = await getTaiexData(startDate, endDate, maxMa);
    const taiexMaData = calculateMovingAverages(taiexData, ma).filter((obj) => obj.date >= startDate);
    const taiexInfo =  taiexData.filter((obj) => obj.date >= startDate).map((ele, index) => {
      const { date, ...rest } = ele;
      return { ...rest, ...taiexMaData[index]};
    });
  
    const kdData = getKD(stockData).filter((obj) => obj.date >= startDate);  
    const kdTxt = `const kdData = ${JSON.stringify(kdData)}\n`;
    
    const startMarker = "// The trigger you want to set up, it can be empty;\n";
    const endMarker = "// Loop area\n";
    const startTxt = code.indexOf(startMarker) + startMarker.length;
    const endTxt = code.indexOf(endMarker);
    const triggerText = code.substring(startTxt, endTxt);
    if (code.substring(endTxt).trim() === "// Condition area") {
      throw new Error('The Condition area is empty')
    }
    
    const stockInfoText = `const stockInfo = ${JSON.stringify(stockInfo)};\n`+
    `const taiexInfo = ${JSON.stringify(taiexInfo)};\n`+ kdTxt +
    `const type = ${JSON.stringify(type)};\n`;
    
    const startIndex = code.indexOf("// Loop area") + "// loop area".length;
    const execTxt = code.substring(startIndex).trim();
    
    if (execTxt === '') {
      throw new Error('The loop area is empty.')
    }

    const { transactions } = vmProcess(stockInfoText+ triggerText+ execLoopText+ execTxt+ closeTxt);

    const { realizedProfitLoss, profitRecords, profitRecordsByDate } = calculateProfitLoss(transactions, type);
  
    const numberOfGains = profitRecords.filter(num => num > 0).length;
    const numberOfLosses = profitRecords.filter(num => num <= 0).length;

    const report = {
      candleData: stockInfo,
      perTrade: transactions,
      successRate: Number(((numberOfGains / profitRecords.length) * 100).toFixed(2)),
      totalTradeTimes: transactions.length,
      numberOfGains,
      numberOfLosses,
      totalProfit: realizedProfitLoss,
      maximumProfit: Math.max(...profitRecords),
      maximumLoss: Math.min(...profitRecords),
      profitRecordsByDate
    };
    res.status(200).json({report});    
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({error: err.message});
    }
  }
}