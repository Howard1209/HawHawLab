import pool from "../dist/models/databasePool.js";
import { getStockList, getStockDetail } from "../dist/models/stockModel.js";
import { findUser } from "../dist/models/userModel.js";

const results1 = [
  {
    stock_id: '3707',
    open: 87.9,
    high: 88.5,
    low: 86,
    close: 86.7,
    spread: -1.3,
    spreadPCT: -1.48,
    trading_volume: 6391,
    name: '漢磊'
  },
  {
    stock_id: '2368',
    open: 148,
    high: 152,
    low: 145,
    close: 148.5,
    spread: -0.5,
    spreadPCT: -0.34,
    trading_volume: 11860,
    name: '金像電'
  },
  {
    stock_id: '6288',
    open: 34.3,
    high: 35.4,
    low: 33.75,
    close: 34.55,
    spread: 0.25,
    spreadPCT: 0.73,
    trading_volume: 9209,
    name: '聯嘉'
  },
  {
    stock_id: '2486',
    open: 45.75,
    high: 46.15,
    low: 44.65,
    close: 45.7,
    spread: -0.7,
    spreadPCT: -1.51,
    trading_volume: 6334,
    name: '一詮'
  },
  {
    stock_id: '4919',
    open: 133,
    high: 133,
    low: 130,
    close: 131,
    spread: -3,
    spreadPCT: -2.24,
    trading_volume: 5269,
    name: '新唐'
  },
  {
    stock_id: '2618',
    open: 39.85,
    high: 40.6,
    low: 39.6,
    close: 39.8,
    spread: 0,
    spreadPCT: 0,
    trading_volume: 109048,
    name: '長榮航'
  },
  {
    stock_id: '2376',
    open: 262.5,
    high: 269,
    low: 253,
    close: 261,
    spread: -3,
    spreadPCT: -1.14,
    trading_volume: 19204,
    name: '技嘉'
  },
  {
    stock_id: '2330',
    open: 565,
    high: 572,
    low: 563,
    close: 565,
    spread: 0,
    spreadPCT: 0,
    trading_volume: 19859,
    name: '台積電'
  },
  {
    stock_id: '8086',
    open: 101,
    high: 101.5,
    low: 96.3,
    close: 96.4,
    spread: -4.6,
    spreadPCT: -4.55,
    trading_volume: 9321,
    name: '宏捷科'
  },
  {
    stock_id: '3035',
    open: 251,
    high: 253.5,
    low: 235,
    close: 244.5,
    spread: -9,
    spreadPCT: -3.55,
    trading_volume: 35233,
    name: '智原'
  },
  {
    stock_id: '2382',
    open: 162,
    high: 166.5,
    low: 160,
    close: 160.5,
    spread: -4.5,
    spreadPCT: -2.73,
    trading_volume: 51610,
    name: '廣達'
  },
  {
    stock_id: '1504',
    open: 51.3,
    high: 51.7,
    low: 50.2,
    close: 51,
    spread: -0.5,
    spreadPCT: -0.97,
    trading_volume: 14427,
    name: '東元'
  },
  {
    stock_id: '6285',
    open: 109,
    high: 109.5,
    low: 107,
    close: 107,
    spread: -0.5,
    spreadPCT: -0.47,
    trading_volume: 21437,
    name: '啟基'
  },
  {
    stock_id: '3363',
    open: 51.1,
    high: 52.4,
    low: 48.05,
    close: 50.5,
    spread: -0.5,
    spreadPCT: -0.98,
    trading_volume: 23913,
    name: '上詮'
  },
  {
    stock_id: '2330',
    open: 573,
    high: 574,
    low: 565,
    close: 565,
    spread: -17,
    spreadPCT: -2.92,
    trading_volume: 32070,
    name: '台積電'
  },
  {
    stock_id: '4919',
    open: 136,
    high: 138.5,
    low: 133.5,
    close: 134,
    spread: -2,
    spreadPCT: -1.47,
    trading_volume: 8325,
    name: '新唐'
  },
  {
    stock_id: '2618',
    open: 39.6,
    high: 40,
    low: 39.1,
    close: 39.8,
    spread: -0.2,
    spreadPCT: -0.5,
    trading_volume: 115724,
    name: '長榮航'
  },
  {
    stock_id: '3035',
    open: 251.5,
    high: 264.5,
    low: 251.5,
    close: 253.5,
    spread: -2,
    spreadPCT: -0.78,
    trading_volume: 24921,
    name: '智原'
  },
  {
    stock_id: '2376',
    open: 257.5,
    high: 271.5,
    low: 256.5,
    close: 264,
    spread: -1,
    spreadPCT: -0.38,
    trading_volume: 23025,
    name: '技嘉'
  },
  {
    stock_id: '8086',
    open: 93.8,
    high: 102.5,
    low: 92.1,
    close: 101,
    spread: 7.1,
    spreadPCT: 7.56,
    trading_volume: 14084,
    name: '宏捷科'
  }
];

test('Get stock list', async () => {
  const data = await getStockList();
  expect(data).toStrictEqual(results1);
});

const results2 = {
  id: 2269,
  stock_id: '8086',
  date: '2022-10-05',
  open: 62.1,
  high: 66.8,
  low: 61.8,
  close: 65,
  spread: 3.6,
  spreadPCT: 5.86,
  amplitudePCT: 7.69,
  trading_volume: 3836,
  trading_turnover: 2672,
  trading_money: 247899000,
  foreign_investors: 342,
  investment_trust: 0,
  dealer_self: 10,
  dealer_hedging: -26,
  investors_total: 326,
  ma5: 61.48,
  ma10: 63.84,
  ma20: 69.21
};

test('Get stock detail', async() => {
  const data = await getStockDetail(8086);
  expect(data[0]).toStrictEqual(results2);
})

const results3 = {
  id: 2,
  email: 'ggg@gmail.com',
  name: 'ggg',
  password: '$argon2id$v=19$m=65536,t=3,p=4$N1c4GXOic3nT8QfI8BEzFw$b/gm1Oc+Cyayvw6ecRX9EFrUfcorRrpPLIpn7gRrsqM'
}

test('Find user ', async() => {
  const data = await findUser('ggg@gmail.com');
  expect(data).toStrictEqual(results3);
});

afterAll(async () => {
  await pool.end();
});
