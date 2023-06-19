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

  interface ColumnInSQL {
    [key: string]: string;
  }

  const evaluateInvestorCondition = (currentMethod: string, currentValue: number, currentSymbol:string) => {
    const columnInSQL : ColumnInSQL = {
      investmentTrust: 'investment_trust',
      foreignInvestors: 'foreign_investors',
      dealerSelf: 'dealer_self'
    };
    // @ts-ignore
    const total = stock[columnInSQL[currentMethod]];
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
  
  interface Mapping {
    [key: string]: Function;
  }

  const mapping: Mapping = {
    ma: evaluateMaCondition,
    kd: evaluateKdCondition,
    investmentTrust: evaluateInvestorCondition,
    taiex: evaluateTaiexCondition,
    stopLoss: stopLossCondition,
    stopProfit: stopProfitCondition,
  };

  if (Array.isArray(method) && Array.isArray(value) && Array.isArray(symbol)) {
    const results = method.map((currentMethod: string, index: number) => mapping[currentMethod](method[index], value[index], symbol[index]));
    if (position === 'none') {
      return results.every(result => result === true);
    }
    return results.some(result => result === true);
  }

  if( typeof method === 'string') return mapping[method](method, value, symbol);

  // 沒有結果也要 throw error 了
}
