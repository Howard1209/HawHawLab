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
  let realizedProfitLoss = 0;
  let remainingQty = 0;
  let fifoQueue = [];
  const profitRecords = [];
  const profitRecordsByDate = [];
  try {
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
  } catch(err){
    throw new Error('Looks like a logical error in your action buying or selling area')
  }
}
