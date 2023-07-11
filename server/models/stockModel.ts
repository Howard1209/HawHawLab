import { z } from 'zod';
import pool from "./databasePool.js";
const StockListSchema = z.object({
  stock_id: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  spread: z.number(),
  spreadPCT: z.number(),
  trading_volume: z.number(),
  name: z.string()
});

export async function getStockList() {
  const results = await pool.query(
    `
    SELECT si.stock_id, si.open, si.high, si.low, si.close, si.spread, si.spreadPCT, si.trading_volume, sl.name
    FROM stock_info AS si
    JOIN stock_list AS sl ON si.stock_id = sl.stock_id
    ORDER BY date DESC limit ${process.env.STOCKS};
    `
  );
  const data = z.array(StockListSchema).parse(results[0]);  
  return data;
}

const StockDataSchema = z.object({
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
  ma5: z.number(),
  ma10: z.number(),
  ma20: z.number(),
});

const AdjStockDataSchema = z.object({
  id: z.number(),
  stock_id: z.string(),
  date: z.string(),
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
  ma5: z.number(),
  ma10: z.number(),
  ma20: z.number(),
});


export async function getStockDetail(stockId:string) {
  const results = await pool.query(
    `
    SELECT *,
      CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS FLOAT) as ma5,
      CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 9 PRECEDING AND CURRENT ROW) AS FLOAT) as ma10,
      CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 19 PRECEDING AND CURRENT ROW) AS FLOAT) as ma20
    FROM stock_info 
    WHERE stock_id = ? 
    ORDER BY date DESC LIMIT 180
    `,[stockId]);  
  const data = z.array(StockDataSchema).parse(results[0]);
  
  const adjData = data.map((item) => {
    const adjustedDate = new Date(item.date);
    adjustedDate.setHours(adjustedDate.getHours() + 8); // Add 8 hours to the date
    return {
      ...item,
      date: adjustedDate.toISOString().split('T')[0],
    };
  });
  const stockData = z.array(AdjStockDataSchema).parse(adjData);
  return stockData.reverse();
}