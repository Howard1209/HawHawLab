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
}

export async function getStockData (startDate:string, endDate:string, stockId:string, maxMa:number) {
  const [data] = await pool.query(`
  (
    SELECT * FROM stock_info WHERE date >= ? AND date <= ? AND stock_id = ?
  )
  UNION ALL
  (
    SELECT * FROM stock_info WHERE date < ? AND stock_id = ? ORDER BY date DESC LIMIT ?
  )
  ORDER BY date
  `,[startDate, endDate, stockId, startDate, stockId, maxMa]);
  const stockData = z.array(stockDataSchema).parse(data);
  
  // focus on time zone still not work
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
});

export type AdjTaiexTaiexDataSchema = {
  id: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function getTaiexData (startDate:string, endDate:string, maxMa:number) {
  const [data] = await pool.query(`
  (
    SELECT * FROM taiex WHERE date >= ? AND date <= ?
  )
  UNION ALL
  (
    SELECT * FROM taiex WHERE date < ?  ORDER BY date DESC LIMIT ?
  )
  ORDER BY date
  ` , [startDate, endDate, startDate, maxMa]);
  
  const taiexData = z.array(TaiexDataSchema).parse(data);

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
  let realizedProfitLoss = 0;
  let remainingQty = 0;
  let fifoQueue = [];
  const profitRecords = [];
  const profitRecordsByDate = [];

  if (type === 'long') {
    for (const transaction of transactions) {
      if (transaction.type === 'buy') {
        remainingQty += transaction.qty;
        fifoQueue.push(transaction);
      } else if (transaction.type === 'sell') {
        let sellQty = transaction.qty;
        let profit = 0;
        while (sellQty > 0) {
          const earliestBuy = fifoQueue[0];
          if (earliestBuy.qty <= sellQty) {
            const buyPrice = earliestBuy.price;
            profit += (transaction.price - buyPrice) * earliestBuy.qty * 1000;
            sellQty -= earliestBuy.qty;
            remainingQty -= earliestBuy.qty;
            fifoQueue.shift();
          } else {
            const buyPrice = earliestBuy.price;
            profit += (transaction.price - buyPrice) * sellQty * 1000;
            earliestBuy.qty -= sellQty;
            remainingQty -= sellQty;
            sellQty = 0;
          }
        }
        realizedProfitLoss += profit;
        profitRecords.push(profit);
        profitRecordsByDate.push({date:transaction.date, profit});
      }
    }  
  } else {
    for (const transaction of transactions) {
      if (transaction.type === 'sell') {
        remainingQty += transaction.qty;
        fifoQueue.push(transaction);
      } else if (transaction.type === 'buy') {
        let sellQty = transaction.qty;
        let profit = 0;
        while (sellQty > 0) {
          const earliestBuy = fifoQueue[0];
          if (earliestBuy.qty <= sellQty) {
            const buyPrice = earliestBuy.price;
            profit += (buyPrice - transaction.price) * earliestBuy.qty * 1000;
            sellQty -= earliestBuy.qty;
            remainingQty -= earliestBuy.qty;
            fifoQueue.shift();
          } else {
            const buyPrice = earliestBuy.price;
            profit += (buyPrice - transaction.price) * sellQty * 1000;
            earliestBuy.qty -= sellQty;
            remainingQty -= sellQty;
            sellQty = 0;
          }
        }
        realizedProfitLoss += profit;
        profitRecords.push(profit);
        profitRecordsByDate.push({date:transaction.date, profit});
      }
    }  
  }
  return { realizedProfitLoss, profitRecords, profitRecordsByDate };
}
