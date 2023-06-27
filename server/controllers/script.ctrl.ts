import { Request, Response } from 'express';
import fs from 'fs';
import { execFile } from "child_process";
import { getStockData, getTaiexData, calculateProfitLoss } from '../models/stockInfo.js';
import { calculateMA, getKD } from '../models/technicalAnalysis.js';
import { execDimText, closeTxt } from '../worker/worker.js'


export default async function backtestingScript(req: Request, res: Response){
  const {code} = req.body;

  const endIndex = code.indexOf("// The trigger you want to set up, i can be empty;");
  const dimTxt = code.substring(0, endIndex);
  if (dimTxt === '') {
    res.status(400).json({message: 'You made changes to condition area.'});
    return
  }

  const dim = 'testDim.js';
  fs.writeFileSync(dim, dimTxt);  
  const promise:string = await new Promise((resolve, reject) => {
    execFile('node',[dim], { timeout: 1000 } , (error, stdout, stderr) => {
      if (error) {
        console.error('stderr', error);
        reject(stderr);
      }
      resolve(stdout);
    });
  });

  // fs.unlink(dim, function(error){
  //   if(error){
  //       console.log(error);
  //       return false;
  //   }
  //   console.log('刪除檔案成功');
  // });

  const startMarker = "// The trigger you want to set up, i can be empty;\n";
  const endMarker = "// Condition area\n";
  const startTxt = code.indexOf(startMarker) + startMarker.length;
  const endTxt = code.indexOf(endMarker);
  const triggerText = code.substring(startTxt, endTxt);

  
  const {startDate, endDate, stockId, ma, type} = JSON.parse(promise);
  const maxMa = Math.max(...ma); 

  const stockData = await getStockData(startDate, endDate, stockId, maxMa);
  const maData = calculateMA(stockData, ma, startDate);
  const stockInfo = stockData.filter((obj) => obj.date >= startDate).map((ele, index) => {
    return { ...ele, ma5: maData[5][index], ma10: maData[10][index], ma20: maData[20][index]};
  });

  const taiexData = await getTaiexData(startDate, endDate, maxMa);
  const taiexMaData = calculateMA(taiexData, ma, startDate);  
  const taiexInfo =  taiexData.filter((obj) => obj.date >= startDate).map((ele,index) => {
    return { ...ele, ma5: taiexMaData[5][index], ma10: taiexMaData[10][index], ma20: taiexMaData[20][index]};
  });

  
  const stockInfoText = `const stockInfo = ${JSON.stringify(stockInfo)};\n`+
  `const taiexInfo = ${JSON.stringify(taiexInfo)};\n`+
  `const type = ${JSON.stringify(type)};\n`;

  const startIndex = code.indexOf("// Condition area\n") + "// Condition area\n".length;
  const execTxt = code.substring(startIndex);

  if (execTxt === '') {
    res.status(400).json({message: 'You have a type error in condition area.'});
    return
  }
  console.log(execTxt);
  const exec = 'textExec.js';
  fs.writeFileSync(exec, stockInfoText + triggerText + execDimText + execTxt + closeTxt);  
  const result:string = await new Promise((resolve, reject) => {
    execFile('node',[exec], { timeout: 3000 } , (error, stdout, stderr) => {
      if (error) {
        console.error('stderr', error);
        resolve(stderr);
      }
      resolve(stdout);
    });
  });

  const { transactions }= JSON.parse(result);
  const { realizedProfitLoss, profitRecords, profitRecordsByDate } = calculateProfitLoss(transactions);
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

  console.log(report);
  
  res.status(200).json({report});  
}