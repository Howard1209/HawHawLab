import { checkCondition } from "./condition.js";
import { getKD } from "./technicalAnalysis.js";
import { type MaValues } from "./technicalAnalysis.js"
import { type AdjStockDataSchema, type AdjTaiexTaiexDataSchema } from "./stockInfo.js";

export async function getBacktestingReport(
  startDate: string,
  stockData: AdjStockDataSchema[],
  type: string,
  maData: MaValues,
  openCondition: {
    method: string | string[],
    symbol: string | string[],
    value: number | string | (number | string)[],
  },
  closeCondition: {
    method: string | string[],
    symbol: string | string[],
    value: number | string | (number | string)[],
  },
  taiexMaData: MaValues
  ) {
  let position = 'none';
  let openPrice = 0;
  let closePrice = 0;
  let totalProfit = 0;
  let totalTrades = 0;
  const entryDates = [];
  const exitDates: any[] = [];
  const profits:number[] = [];

  const usePriceCondition = ['foreignInvestors', 'investmentTrust', 'dealerSelf'];
  const useOpenStockPriceInClose = Array.isArray(closeCondition.method)
  ? closeCondition.method.some((method) => usePriceCondition.includes(method))
  : usePriceCondition.includes(closeCondition.method);
  const kdArr = (openCondition.method === 'kd' || closeCondition.method === 'kd') ? getKD(stockData) : [];

  for (let i = 0; i < stockData.length; i++) {
    const stock = stockData[i];
    const currentDate = new Date(stock.date).getTime();

    if (currentDate < new Date(startDate).getTime()) {
      continue;
    }

    // open condition 如果是盤後選股都應該是隔天買，依照盤後選股理論，但使用者可以選擇要隔天open or close 買入。
    if (position === 'none' && checkCondition(stockData[i-1], openCondition, maData, i-1, kdArr[i-1], taiexMaData, position, openPrice)) {
      position = 'trading';
      openPrice = stock.open;
      entryDates.push({ openDay: stock.date, price: openPrice });
    }

    // close condition 賣掉的情況 應該是當天收盤價有達到條件就要出場，看要不要給停利跟停損的條件，但如果是根據盤後資料出場就應該是隔天開盤價賣出
    if (position === 'trading') {
      const isLastDay = i + 1 === stockData.length;
      const isCloseConditionMet = useOpenStockPriceInClose
        ? checkCondition(stockData[i-1], closeCondition, maData, i-1, kdArr[i-1], taiexMaData, position, openPrice)
        : checkCondition(stock, closeCondition, maData, i, kdArr[i], taiexMaData, position, openPrice);

      if (isCloseConditionMet || isLastDay) {
        position = 'none';
        closePrice = useOpenStockPriceInClose ? stock.open : stock.close; // 依照盤後的理論useOpenStockPriceInClose都是開盤價出場
        const profit = (type === 'long') ? (closePrice - openPrice) * 1000 : (openPrice - closePrice) * 1000;
        totalProfit += profit;
        totalTrades++;
        exitDates.push({ closeDay: stock.date, price: closePrice });
        profits.push(profit);
      }
    }
  }

  const perTradeResult = entryDates.map((ele, index) => ({
    openDay: ele.openDay,
    openPrice: ele.price,
    closeDay: exitDates[index].closeDay,
    closePrice: exitDates[index].price,
    profit: profits[index]
  }));

  const stockDataByUserStartDate = stockData.filter(item => item.date >= startDate); // 之後畫圖會用到
  const numberOfGains = profits.filter(num => num > 0).length;
  const numberOfLosses = profits.filter(num => num <= 0).length;

  const report = {
    perTrade: perTradeResult,
    successRate: Number(((numberOfGains / totalTrades) * 100).toFixed(2)),
    totalTradeTimes: totalTrades,
    numberOfGains,
    numberOfLosses,
    totalProfit,
    maximumProfit: Math.max(...profits),
    maximumLoss: Math.min(...profits)
  };

  return report;
}
