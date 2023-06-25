import { z } from 'zod';
import { type StockDataSchema } from "./backtestingModel.js"; 

function checkMaSituation(ma5:number, ma10:number, ma20:number) {
  if (ma5 > ma10 && ma10 > ma20) {
    return 'long';
  } else if (ma5 < ma10 && ma10 < ma20) {
    return 'short'
  }
  return 'volatile';
}

export function checkCondition(
  stock: StockDataSchema,
  condition: {
    method : string | string[],
    symbol : string | string[],
    value : number | number[]
  },
  index: number,
  kd: { k: number, d: number },
  taiexMaData: {[period: number]: (number)[]},
  position: string,
  openPrice: number
  ) {
  const { method, symbol, value } = condition;
  let stockPrice = stock.close;

  const evaluateMaCondition = (currentMethod: string, currentValue: string, currentSymbol: string) => {  
      
    const maValue = z.number().parse(stock[currentValue]);
    stockPrice = z.number().parse(stock[currentMethod]);
    return (currentSymbol === 'greater') ? stockPrice > maValue : stockPrice < maValue;
  };

  const evaluateMaTypeCondition = (currentMethod: string, currentValue: string, currentSymbol: string) => {
    const ma5 = stock.ma5;
    const ma10 = stock.ma10;
    const ma20 = stock.ma20;
    const result = checkMaSituation(ma5, ma10, ma20);
    return currentSymbol === result;
  }

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
      dealerSelf: 'dealer_self',
      investorsAll:'investors_total,'
    };
    const numberParser = z.number();
    const total = numberParser.parse(stock[columnInSQL[currentMethod]]);
    return (currentSymbol === 'greater') ? total > currentValue : total < currentValue;
  };

  const evaluateTaiexCondition = (_currentMethod: string, _currentValue: string, currentSymbol: string) => {
    const ma5 = taiexMaData[5][index];
    const ma10 = taiexMaData[10][index];
    const ma20 = taiexMaData[20][index];
    const result = checkMaSituation(ma5, ma10, ma20);
    return currentSymbol === result;  
  };

  const spreadCondition = (_currentMethod: string, currentValue: string, currentSymbol:string) => {
    const userSpreadPCT = parseFloat(currentValue);
    const stockSpreadPCT = stock.spreadPCT;
    return (currentSymbol === 'greater') ? stockSpreadPCT > userSpreadPCT : stockSpreadPCT < userSpreadPCT;
  };
  
  interface MappingSchema {
    [key: string]: Function;
  }
  
  const mapping: MappingSchema = {
    close: evaluateMaCondition,
    ma:evaluateMaTypeCondition,
    kd: evaluateKdCondition,
    investmentTrust: evaluateInvestorCondition,
    foreignInvestors:evaluateInvestorCondition,
    dealerSelf: evaluateInvestorCondition,
    investorsAll:evaluateInvestorCondition,
    taiex: evaluateTaiexCondition,
    spreadPCT: spreadCondition,
  };

  if (Array.isArray(method) && Array.isArray(value) && Array.isArray(symbol)) {
    const results = method.map((currentMethod: string, index: number) => mapping[currentMethod](method[index], value[index], symbol[index]));
    if (position === 'none') {
      return results.every(result => result === true);
    }
    return results.some(result => result === true);
  }
  const zodMethod = z.string().parse(method);
  return mapping[zodMethod](method, value, symbol);

}
