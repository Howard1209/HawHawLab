import { Request, Response } from 'express';
import { getStockData, getTaiexData, calculateProfitLoss } from '../models/stockInfo.js';
import { execLoopText, closeTxt } from '../util/worker.js';
import { queue, sub } from '../models/redis.js';
import vmProcess from '../util/vm.js';

export default async function backtestingScript(req: Request, res: Response){
  try {
    const {code} = req.body;

    const result = await queue.lpush("queues", JSON.stringify(code));
    
    console.log(result);
    
    if (result) {
      const subMessage = new Promise<{ report?: object; error?: object }> (( resolve, reject) => {
        sub.subscribe("script", "error", (err) => {if (err) reject(err);});
        sub.on("message", (channel, message) => {
          console.log(`Received message from ${channel} channel.`);
          sub.unsubscribe();
          resolve(JSON.parse(message));
        });  
      });

      const {report , error} = await subMessage;

      if (error) {
        res.status(400).json({error});
        return
      }
      res.status(200).json({report});    
      return
    }
    
    console.log('redis is not working');
    
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

    if (String(stockId).length !== 4) {
      throw new Error('The number of stockId should be 4')
    }
    
    if (type !== 'long' && type !== 'short'){
      throw new Error('The type is error')
    }
    
    const stockData = await getStockData(startDate, endDate, String(stockId));
  
    const taiexData = await getTaiexData(startDate, endDate);

    const startMarker = "// The trigger you want to set up, it can be empty;\n";
    const endMarker = "// Loop area\n";
    const startTxt = code.indexOf(startMarker) + startMarker.length;
    const endTxt = code.indexOf(endMarker);
    const triggerText = code.substring(startTxt, endTxt);
    if (code.substring(endTxt).trim() === "// Condition area") {
      throw new Error('The Condition area is empty')
    }
    
    const stockInfoText = `const stockInfo = ${JSON.stringify(stockData)};\n`+
    `const taiexInfo = ${JSON.stringify(taiexData)};\n`+
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
      candleData: stockData,
      perTrade: transactions,
      successRate: Number(((numberOfGains / profitRecords.length) * 100).toFixed(2)),
      totalTradeTimes: transactions.length,
      numberOfGains,
      numberOfLosses,
      totalProfit: Math.round(realizedProfitLoss),
      maximumProfit: Math.round(Math.max(...profitRecords)),
      maximumLoss: Math.round(Math.min(...profitRecords)),
      profitRecordsByDate
    };
    res.status(200).json({report});    
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({error: err.message});
      return
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
