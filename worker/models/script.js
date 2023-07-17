import vmProcess from "./vm.js"
import { getStockData, getTaiexData, calculateProfitLoss } from "./stockinfo.js"
import { execLoopText, closeTxt } from '../util/loopText.js';

export async function getReport(results) {
  const code = JSON.parse(results);

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

  return report;
}