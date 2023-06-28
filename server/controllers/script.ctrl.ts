import { Request, Response } from 'express';
import {NodeVM, VMScript} from 'vm2';
import { getStockData, getTaiexData, calculateProfitLoss } from '../models/stockInfo.js';
import { calculateMovingAverages, getKD } from '../models/technicalAnalysis.js';
import { execDimText, closeTxt } from '../worker/worker.js'


export default async function backtestingScript(req: Request, res: Response){
  const {code} = req.body;
  
  const endIndex = code.indexOf("// The trigger you want to set up, it can be empty;");
  const dimTxt = code.substring(0, endIndex);
  if (dimTxt === '') {
    res.status(400).json({error: 'You made changes to condition area.'});
    return
  }
  
  const vmDim = new NodeVM();
  const scriptDim = new VMScript(dimTxt);
  const {startDate, endDate, stockId, ma, type} = vmDim.run(scriptDim);

  if (! startDate && endDate && stockId && ma && type) {
    res.status(400).json({error: 'You need to fill in the following information: startDate, endDate, stockId, ma, type.'});
    return
  }

  if (startDate > endDate){
    res.status(400).json({error: 'The start date is greater than the end date.'});
    return
  }
  
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

  const { kd } = vmDim.run(scriptDim);
  const kdData = kd? getKD(stockData).filter((obj) => obj.date >= startDate): null;  
  
  const startMarker = "// The trigger you want to set up, it can be empty;\n";
  const endMarker = "// Condition area\n";
  const startTxt = code.indexOf(startMarker) + startMarker.length;
  const endTxt = code.indexOf(endMarker);
  const triggerText = code.substring(startTxt, endTxt);

  const kdTxt = kdData ? `const kdData = ${JSON.stringify(kdData)}\n`:'';
  
  const stockInfoText = `const stockInfo = ${JSON.stringify(stockInfo)};\n`+
  `const taiexInfo = ${JSON.stringify(taiexInfo)};\n`+ kdTxt +
  `const type = ${JSON.stringify(type)};\n`;
    

  const startIndex = code.indexOf("// Condition area\n") + "// Condition area\n".length;
  const execTxt = code.substring(startIndex);

  if (execTxt === '') {
    res.status(400).json({message: 'You have an error in condition area.'});
    return
  }
  
  const vmExec = new NodeVM();
  const scriptExec = new VMScript(stockInfoText + triggerText + execDimText + execTxt + closeTxt);
  const { transactions } = vmExec.run(scriptExec);
  
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
}