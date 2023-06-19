import { z } from "zod";
import { type MaValues } from "./technicalAnalysis.js"
import { type AdjStockDataSchema } from "./stockInfo.js";


function checkTaiexSituation(ma5:number, ma10:number, ma20:number) {
  if (ma5 > ma10 && ma10 > ma20) {
    return 'bullish';
  } else if (ma5 < ma10 && ma10 < ma20) {
    return 'bearish'
  }
  return 'volatile';
}

// const mappingKeySchema = z.enum(["ma", "kd", "investmentTrust", "taiex", "stopLoss", "stopProfit"]);

export function checkCondition(
  stock: AdjStockDataSchema,
  condition: {
    method : string | string[],
    symbol : string | string[],
    value : number | string | (number | string)[]
  },
  maData: MaValues,
  index: number,
  kd: { k: number, d: number },
  taiexMaData: MaValues,
  position: string,
  openPrice: number
  ) {
  const { method, symbol, value } = condition;
  // const methods = Array.isArray(method) ? z.array(mappingKeySchema).parse(method) : mappingKeySchema.parse(method);
  const stockPrice = stock.close;

  const evaluateMaCondition = (_currentMethod: string, currentValue: number, currentSymbol: string) => {
    const maValue = maData[currentValue][index];
    if (maValue) {
      return (currentSymbol === 'greater') ? stockPrice > maValue : stockPrice < maValue;
    }
    // 之後要改成 throw error
    return false
  };

  const evaluateKdCondition = (_currentMethod: string, currentValue: number, currentSymbol: string) => {
    const kValue = kd.k;
    return (currentSymbol === 'greater') ? kValue > currentValue : kValue < currentValue;
  };

  const evaluateInvestorCondition = (currentMethod: string, currentValue: number, currentSymbol:string) => {
    interface ColumnInSQL {
      [key: string]: string;
    }
    const columnInSQL : ColumnInSQL = {
      investmentTrust: 'investment_trust',
      foreignInvestors: 'foreign_investors',
      dealerSelf: 'dealer_self'
    };
    const obj = columnInSQL[currentMethod];
    const total = stock[obj];
    return (currentSymbol === 'greater') ? total > currentValue : total < currentValue;
  };

  const evaluateTaiexCondition = (_currentMethod: string, currentValue: string, _currentSymbol: string) => {
    const ma5 = taiexMaData[5][index];
    const ma10 = taiexMaData[10][index];
    const ma20 = taiexMaData[20][index];
    if (ma5 && ma10 && ma20) {
      const result = checkTaiexSituation(ma5, ma10, ma20);
      return currentValue === result;  
    }
    // 之後要改成 throw error
    return false
  };

  const stopLossCondition = (_currentMethod: string, currentValue: number, currentSymbol:string) => {
    const spreadPercentage = currentValue / 100;
    const spreadPrice = openPrice - openPrice * spreadPercentage;
    return (currentSymbol === 'greater') ? stockPrice > spreadPrice : stockPrice < spreadPrice;
  };

  const stopProfitCondition = (_currentMethod: string, currentValue: number, currentSymbol:string) => {
    const spreadPercentage = currentValue / 100;
    const spreadPrice = openPrice + openPrice * spreadPercentage;
    return (currentSymbol === 'greater') ? stockPrice > spreadPrice : stockPrice < spreadPrice;
  };

  const mapping = {
    ma: evaluateMaCondition,
    kd: evaluateKdCondition,
    investmentTrust: evaluateInvestorCondition,
    taiex: evaluateTaiexCondition,
    stopLoss: stopLossCondition,
    stopProfit: stopProfitCondition,
  };

  if (Array.isArray(method) && Array.isArray(value) && Array.isArray(symbol)) {
    const results = method.map((currentMethod, index: number) => mapping[currentMethod](method[index], value[index], symbol[index]));
    if (position === 'none') {
      return results.every(result => result === true);
    }
    return results.some(result => result === true);
  }
  
  return mapping[method](method, value, symbol);
}
