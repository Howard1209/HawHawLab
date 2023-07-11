import { z } from 'zod';
import { type StockDataSchema } from "./backtestingModel.js"; 
import { type AdjTaiexTaiexDataSchema } from "./stockInfo.js";

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
  taiexData: AdjTaiexTaiexDataSchema,
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

    if (currentSymbol === 'sold' && total > 0) {
      return false;
    }
    if (currentSymbol === 'sold' && total < 0) {
      return Math.abs(total) > currentValue;
    }
    return total > currentValue 
  };

  const evaluateTaiexCondition = (_currentMethod: string, _currentValue: string, currentSymbol: string) => {
    const ma5 = taiexData.ma5;
    const ma10 = taiexData.ma10;
    const ma20 = taiexData.ma20;
    const result = checkMaSituation(ma5, ma10, ma20);
    return currentSymbol === result;  
  };
  
  interface MappingSchema {
    [key: string]: Function;
  }
  
  const mapping: MappingSchema = {
    close: evaluateMaCondition,
    ma:evaluateMaTypeCondition,
    investmentTrust: evaluateInvestorCondition,
    foreignInvestors:evaluateInvestorCondition,
    dealerSelf: evaluateInvestorCondition,
    investorsAll:evaluateInvestorCondition,
    taiex: evaluateTaiexCondition,
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
