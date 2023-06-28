import { z } from 'zod'; 
import { type AdjStockDataSchema, type AdjTaiexTaiexDataSchema } from "./stockInfo.js";

export type MaValues = {
  [period: number]: (number)[]
};

export function calculateMA(data:(AdjStockDataSchema | AdjTaiexTaiexDataSchema)[], maPeriods:number[], startDate: string) {
  const maValues: MaValues = {};
  const closePrices = data.map(item => item.close); 
  const closeDate = data.map((ele) => ele.date);

  for (const maPeriod of maPeriods) {
    const currentMaValues = [];
    let sum = 0;

    for (let i = 0; i < closePrices.length; i++) {
      const close = closePrices[i];
      sum += close;

      if (i >= maPeriod) {
        sum -= closePrices[i - maPeriod];
      }
      if (new Date(closeDate[i]).getTime() < new Date(startDate).getTime()) {
        continue;
      }
      if (i >= maPeriod - 1) {
        const ma = sum / maPeriod;
        currentMaValues.push(ma);
      }
    }
    maValues[maPeriod] = currentMaValues;
  }
  
  return maValues;
}

function calculateRSV(data:AdjStockDataSchema[], index:number, period:number) {
  const currentClose = data[index].close;
  let lowestLow = currentClose;
  let highestHigh = currentClose;
  
  for (let i = index - period + 1; i <= index; i++) {
    const high = data[i].high;
    const low = data[i].low;
    
    if (high > highestHigh) {
      highestHigh = high;
    }
    
    if (low < lowestLow) {
      lowestLow = low;
    }
  }
  
  return ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
}

function getRSV (stockData:AdjStockDataSchema[]) {
  // Calculate RSV for each day
  const period = 9; // Set the period for RSV calculation
  const rsvValues = [];

  for (let i = 0; i < stockData.length; i++) {
    if (i < period - 1) {
      rsvValues.push(null); // Push null for the first (period - 1) days
    } else {
      const rsv = calculateRSV(stockData, i, period);
      rsvValues.push(rsv);
    }
  }
  return rsvValues;
}

export function getKD(stockData:AdjStockDataSchema[]) {
  const rsvValues = getRSV(stockData);
  let k = 50;
  let d = 50;
  const kdValues = [];
  
  for (let i = 0; i < rsvValues.length; i++) {
    const currentRSV = rsvValues[i];
    const previousK = k;
    const previousD = d;
    if (currentRSV !== null) {
      k = (previousK * 2 / 3) + (currentRSV * 1 / 3);
      d = (previousD * 2 / 3) + (k * 1 / 3);
    }
    kdValues.push({ k, d, date: stockData[i].date }); 
  }
  
  return kdValues;
}



export function calculateMovingAverages(data:(AdjStockDataSchema | AdjTaiexTaiexDataSchema)[], periods:number[]) {
  const result = [];

  for (let i = 0; i < data.length; i++) {
    if (i >= Math.max(...periods) - 1) {
      const maValues:{ [key:string]:number } = {};

      for (const period of periods) {
        const maNumber = z.number().parse(period)
        maValues[`ma${maNumber}`] = newCalculateMA(data, i, period);
      }

      const entry = {
        date: data[i].date,
        ...maValues,
      };

      result.push(entry);
    }
  }

  return result;
}

function newCalculateMA(data:(AdjStockDataSchema | AdjTaiexTaiexDataSchema)[], currentIndex:number, period:number) {
  let sum = 0;

  for (let i = currentIndex; i > currentIndex - period; i--) {
    sum += data[i].close;
  }

  return sum / period;
}