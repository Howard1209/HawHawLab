import { z } from 'zod';
import pool from "./databasePool.js"

export async function getStockData(startDate, endDate, stockId) {
  const [stockData] = await pool.query(`
  SELECT *,
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS FLOAT) as ma5,
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 9 PRECEDING AND CURRENT ROW) AS FLOAT) as ma10,
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 19 PRECEDING AND CURRENT ROW) AS FLOAT) as ma20
  FROM stock_info
  WHERE date >= ? AND date <= ? AND stock_id = ?
  `,[startDate, endDate, stockId]);

  // const stockData = z.array(stockDataSchema).parse(data);

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

export async function getTaiexData (startDate, endDate) {
  const [taiexData] = await pool.query(`
  SELECT *, 
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS FLOAT) as ma5,
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 9 PRECEDING AND CURRENT ROW) AS FLOAT) as ma10,
    CAST(avg(close) OVER(ORDER BY date ROWS BETWEEN 19 PRECEDING AND CURRENT ROW) AS FLOAT) as ma20
  FROM taiex 
  WHERE date >= ? AND date <= ?
  `,[startDate, endDate]); 

  // const taiexData = z.array(TaiexDataSchema).parse(results[0]);
  
  const adjustedData = taiexData.map((item) => {
    const adjDate = new Date(item.date);
    adjDate.setHours(item.date.getHours() + 8);
    return {
      ...item,
      date: adjDate.toISOString().split('T')[0],
    }
  });
  return adjustedData;
}

export function calculateProfitLoss(transactions, type) {
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
        const earliestTransaction = fifoQueue.shift();
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
