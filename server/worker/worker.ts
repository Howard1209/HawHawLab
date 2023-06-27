export const execDimText =
`let shares = 0;
let openPrice = 0;
let closePrice = 0;
let totalProfit = 0;
let totalTrades = 0;
const entryDates = [];
const exitDates = [];
const profits = [];
const transactions = [];

for (let i = 1; i < stockInfo.length; i++) {
  const stock = stockInfo[i];
  const preStock = stockInfo[i-1];
  const taiex = taiexInfo[i];
  const preTaiex = taiexInfo[i-1];

  const action ={
    buy: (price, qty) => {
      shares += qty;
      transactions.push({ date: stock.date, type: 'buy', qty, price });
    },
    sell: (price, qty) => {
      shares -= qty;
      transactions.push({ date: stock.date, type: 'sell', qty, price });
      totalTrades++;
    }
  };
`;

export const closeTxt = `
const isLastDay = i + 1  === stockInfo.length;
if (isLastDay && shares > 0) {
  action['sell'](stock.close, shares);
}
}
console.log(JSON.stringify({transactions}));
`;

