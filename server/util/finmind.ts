import axios from 'axios';
import { z } from 'zod';
import pool from '../models/databasePool.js';

const fetchStockData = async(stockId:string) => {
  const startDate = '2021-11-01';
  const endDate = '2023-07-24';

  const priceResult = await axios.get('https://api.finmindtrade.com/api/v4/data?', {
    params: {
      dataset: 'TaiwanStockPrice',
      data_id: stockId,
      start_date: startDate,
      end_date: endDate,
      token: process.env.FINMIND_TOKEN
    }
  })

  const PriceDataSchema = z.object({
    date: z.string(),
    stock_id: z.string(),
    Trading_Volume: z.number(),
    Trading_money: z.number(),
    open: z.number(),
    max: z.number(),
    min: z.number(),
    close: z.number(),
    spread: z.number(),
    Trading_turnover: z.number(),
    spreadPCT: z.number().nullish().catch( undefined ),
    amplitudePCT: z.number().nullish().catch( undefined ),
  });

  const priceData = z.array(PriceDataSchema).parse(priceResult.data.data);

  priceData.forEach((perPriceData, index:number) => {
    if (index > 0) {
      const previousClose = priceData[index - 1].close;
      const currentClose = perPriceData.close;
      const changePercentage = parseFloat(((currentClose - previousClose) / previousClose * 100).toFixed(2));
      const spreadPercentage = parseFloat(((perPriceData.max - perPriceData.min) / perPriceData.close * 100).toFixed(2));
      perPriceData['spreadPCT'] = changePercentage;
      perPriceData['amplitudePCT'] = spreadPercentage;
    } else {
      perPriceData['spreadPCT'] = null;
      perPriceData['amplitudePCT'] = null;
    }
    perPriceData['Trading_Volume'] = Math.round(perPriceData['Trading_Volume']/1000);
  });

  // 三大法人
  const investorResult = await axios.get('https://api.finmindtrade.com/api/v4/data?', {
    params: {
      dataset: 'TaiwanStockInstitutionalInvestorsBuySell',
      data_id: stockId,
      start_date: startDate,
      end_date: endDate,
      token: process.env.FINMIND_TOKEN
    }
  })

  const comData = await investorResult.data.data;

  interface Item {
    date: string,
    stock_id: string,
    buy: number,
    name: string,
    sell: number
  }

  const transData = comData.reduce((accInvestor:Item[], item:Item) => {
    const existingItem = accInvestor.find((r) => r.date === item.date && r.stock_id === item.stock_id);
    
    if (existingItem) {
      // @ts-ignore
      existingItem[item.name] = Math.round((item.buy - item.sell)/1000);
    } else {
      
      const newItem = {
        date: item.date,
        stock_id: item.stock_id,
        [item.name]: Math.round((item.buy - item.sell)/1000)
      };
      // @ts-ignore
      accInvestor.push(newItem);
    }
    
    return accInvestor;
  }, []);

  const insertData = priceData.map((ele, index:number) => [
    ele.stock_id, new Date(ele.date), ele.open, ele.max, ele.min, ele.close, ele.spread, ele.spreadPCT, ele.amplitudePCT,
    ele.Trading_Volume, ele.Trading_turnover, ele.Trading_money,
    transData[index].Foreign_Investor, transData[index].Investment_Trust, transData[index].Dealer_self, transData[index].Dealer_Hedging,
    transData[index].Foreign_Investor + transData[index].Investment_Trust + transData[index].Dealer_self + transData[index].Dealer_Hedging
  ]);

  await pool.query(`
  INSERT INTO stock_info (
    stock_id, date, open, high, low, close, spread, spreadPCT, amplitudePCT, trading_volume, trading_turnover, trading_money,
    foreign_investors, investment_trust, dealer_self, dealer_hedging, investors_total
  )
  VALUES ?
  `, [insertData]);

  console.log(`Data processed for stock ID: ${stockId}`);
}

const stockList = process.env.STOCK_LIST;
const stockIds = z.array(z.string()).parse(stockList?.split(','));

const fetchAllStockData = async() => {
  const promises = stockIds.map((stockId:string) => fetchStockData(stockId));
  await Promise.all(promises);
  console.log('All stock process done');
}

fetchAllStockData().catch(console.error);
