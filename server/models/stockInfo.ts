import { z } from 'zod';
import pool from "./databasePool.js";

const stockDataSchema = z.object({
  id: z.number(),
  stock_id: z.string(),
  date: z.date(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  spread: z.number(),
  spreadPCT: z.number(),
  amplitudePCT: z.number(),
  trading_volume: z.number(),
  trading_turnover: z.number(),
  trading_money: z.number(),
  foreign_investors: z.number(),
  investment_trust: z.number(),
  dealer_self: z.number(),
  dealer_hedging: z.number(),
  investors_total: z.number(),
  ma5:z.number(),
  ma10:z.number(),
  ma20:z.number(),
});

export type AdjStockDataSchema = {
  id: number,
  stock_id: string,
  date: string,
  open: number,
  high: number,
  low: number,
  close: number,
  spread: number,
  spreadPCT: number,
  amplitudePCT: number,
  trading_volume: number,
  trading_turnover: number,
  trading_money: number,
  foreign_investors: number,
  investment_trust: number,
  dealer_self: number,
  dealer_hedging: number,
  investors_total: number,
  ma5: number,
  ma10: number
  ma20: number
}

export async function getStockData (startDate:string, endDate:string, stockId:string) {
  const [data] = await pool.query(`
  SELECT *,
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS FLOAT) as ma5,
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 9 PRECEDING AND CURRENT ROW) AS FLOAT) as ma10,
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 19 PRECEDING AND CURRENT ROW) AS FLOAT) as ma20
  FROM stock_info
  WHERE date >= ? AND date <= ? AND stock_id = ?
  `,[startDate, endDate, stockId]);

  const stockData = z.array(stockDataSchema).parse(data);
  
  const adjustedData = stockData.map((item) => {
    const adjustedDate = new Date(item.date);
    adjustedDate.setHours(adjustedDate.getHours() + 8); // Add 8 hours to the date
    return {
      ...item,
      date: adjustedDate.toISOString().split('T')[0],
    };
  });

  return adjustedData;
}

const TaiexDataSchema = z.object({
  id: z.number(),
  date: z.date(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  ma5: z.number(),
  ma10: z.number(),
  ma20: z.number()
});

export type AdjTaiexTaiexDataSchema = {
  id: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  ma5: number;
  ma10: number;
  ma20: number;
}

export async function getTaiexData (startDate:string, endDate:string) {
  const results = await pool.query(
  `
  SELECT *, 
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS FLOAT) as ma5,
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 9 PRECEDING AND CURRENT ROW) AS FLOAT) as ma10,
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 19 PRECEDING AND CURRENT ROW) AS FLOAT) as ma20
  FROM taiex 
  WHERE date >= ? AND date <= ?
  `,[startDate, endDate]); 

  const taiexData = z.array(TaiexDataSchema).parse(results[0]);
  
  const adjustedData: AdjTaiexTaiexDataSchema[] = taiexData.map((item) => {
    const adjDate = new Date(item.date);
    adjDate.setHours(item.date.getHours() + 8);
    return {
      ...item,
      date: adjDate.toISOString().split('T')[0],
    }
  });
  return adjustedData;
}

interface Transaction {
  date: string;
  type: 'buy' | 'sell';
  qty: number;
  price: number;
}

export function calculateProfitLoss(transactions: Transaction[], type:string) {
  const isLong = type === 'long';
  let remainingQty = 0;
  const profitRecords = [];
  const profitRecordsByDate = [];
  const fifoQueue = [];

  try {
    for (const transaction of transactions) {
      if (isLong ? transaction.type === 'buy' : transaction.type === 'sell') {
        remainingQty += transaction.qty;
        fifoQueue.push(transaction);
        continue;
      }

      let sellQty = transaction.qty;
      let profit = 0;

      while (sellQty > 0) {
        const earliestTransaction : any = fifoQueue.shift();
        const buyPrice = earliestTransaction.price;

        if (earliestTransaction.qty <= sellQty) {
          profit += (transaction.price - buyPrice) * earliestTransaction.qty * 1000;
          sellQty -= earliestTransaction.qty;
        } else {
          profit += (transaction.price - buyPrice) * sellQty * 1000;
          earliestTransaction.qty -= sellQty;
          sellQty = 0;
        }

        remainingQty -= earliestTransaction.qty;
        profitRecords.push(profit);
        profitRecordsByDate.push({ date: transaction.date, profit });
        profit=0;
      }
    }

    const realizedProfitLoss = profitRecords.reduce((acc, curr) => acc + curr, 0);
    
    return { realizedProfitLoss, profitRecords, profitRecordsByDate };
  } catch (err) {
    throw new Error('Looks like a logical error in your action buying or selling area');
  }
}
