import { z } from 'zod';
import pool from "./databasePool.js";
import dayjs from 'dayjs'

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

export async function getStockData (formattedDate:string, endDate:string) {
  const [data] = await pool.query(`
  select * from stock_info WHERE date >= '${formattedDate}' AND date <= '${endDate}'
  `);
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

export function formattedDate(startDate:string, ma:number) {
  let count = 0;
  let currentDate = dayjs(startDate);
  while (count < ma) { 
    currentDate = currentDate.subtract(1, 'days');
    // check mon to fri
    if (currentDate.day() >= 1 && currentDate.day() <= 5) {
      count++;
    }
  }
  return currentDate.format('YYYY-MM-DD');
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

export async function getTaiexData (startDate:string, endDate:string) {
  const [data] = await pool.query(`
  SELECT * FROM taiex WHERE date >= ? AND date <= ? ORDER BY date
  ` , [startDate, endDate]);
  
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