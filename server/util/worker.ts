export const execLoopText =
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
      if (type === 'short' && shares > 0) {
        shares -= qty;
        transactions.push({ date: stock.date, type: 'buy', qty, price });
      }
      if (type === 'long') {
        shares += qty;
        transactions.push({ date: stock.date, type: 'buy', qty, price });  
      }
    },
    sell: (price, qty) => {
      if (type === 'long' && shares > 0) {
        shares -= qty;
        transactions.push({ date: stock.date, type: 'sell', qty, price });
        return;
      }
      if (type === 'short') {
        shares += qty;
        transactions.push({ date: stock.date, type: 'sell', qty, price });  
      }
    }
  };  
`;

export const closeTxt = `
const isLastDay = i + 1  === stockInfo.length;
if (isLastDay && shares !== 0) {
  if (type === 'long'){
    action['sell'](stock.close, shares);
  } else {
    action['buy'](stock.close, shares);
  }
}
}
exports = {transactions};
`;

