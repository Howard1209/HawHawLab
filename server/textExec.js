const stockInfo = [{"id":384,"stock_id":"2330","date":"2023-06-01","open":550,"high":554,"low":550,"close":551,"spread":-7,"spreadPCT":-1.25,"amplitudePCT":0.73,"trading_volume":25258,"trading_turnover":25441,"trading_money":13920800000,"foreign_investors":-2903,"investment_trust":142,"dealer_self":169,"dealer_hedging":126,"investors_total":-2466,"ma5":561.8,"ma10":547,"ma20":526.6},{"id":385,"stock_id":"2330","date":"2023-06-02","open":559,"high":564,"low":557,"close":562,"spread":11,"spreadPCT":2,"amplitudePCT":1.25,"trading_volume":34705,"trading_turnover":30644,"trading_money":19460100000,"foreign_investors":8372,"investment_trust":167,"dealer_self":-59,"dealer_hedging":96,"investors_total":8576,"ma5":561,"ma10":550,"ma20":529.7},{"id":386,"stock_id":"2330","date":"2023-06-05","open":560,"high":560,"low":555,"close":555,"spread":-7,"spreadPCT":-1.25,"amplitudePCT":0.9,"trading_volume":17484,"trading_turnover":20211,"trading_money":9730880000,"foreign_investors":-2493,"investment_trust":-300,"dealer_self":-54,"dealer_hedging":-191,"investors_total":-3038,"ma5":558.4,"ma10":552.4,"ma20":532.25},{"id":387,"stock_id":"2330","date":"2023-06-06","open":554,"high":562,"low":553,"close":560,"spread":5,"spreadPCT":0.9,"amplitudePCT":1.61,"trading_volume":21562,"trading_turnover":15551,"trading_money":12043600000,"foreign_investors":3149,"investment_trust":-342,"dealer_self":47,"dealer_hedging":346,"investors_total":3200,"ma5":557.2,"ma10":555.4,"ma20":534.75},{"id":388,"stock_id":"2330","date":"2023-06-07","open":561,"high":568,"low":560,"close":568,"spread":8,"spreadPCT":1.43,"amplitudePCT":1.41,"trading_volume":29092,"trading_turnover":29548,"trading_money":16449300000,"foreign_investors":7436,"investment_trust":1451,"dealer_self":202,"dealer_hedging":137,"investors_total":9226,"ma5":559.2,"ma10":559.7,"ma20":538},{"id":389,"stock_id":"2330","date":"2023-06-08","open":562,"high":568,"low":555,"close":559,"spread":-9,"spreadPCT":-1.58,"amplitudePCT":2.33,"trading_volume":25251,"trading_turnover":27238,"trading_money":14190400000,"foreign_investors":-3260,"investment_trust":-233,"dealer_self":-206,"dealer_hedging":-66,"investors_total":-3765,"ma5":560.8,"ma10":561.3,"ma20":541},{"id":390,"stock_id":"2330","date":"2023-06-09","open":561,"high":566,"low":561,"close":565,"spread":6,"spreadPCT":1.07,"amplitudePCT":0.88,"trading_volume":19776,"trading_turnover":16713,"trading_money":11160700000,"foreign_investors":5015,"investment_trust":-106,"dealer_self":181,"dealer_hedging":246,"investors_total":5336,"ma5":561.4,"ma10":561.2,"ma20":544.45},{"id":391,"stock_id":"2330","date":"2023-06-12","open":574,"high":574,"low":571,"close":574,"spread":9,"spreadPCT":1.59,"amplitudePCT":0.52,"trading_volume":28657,"trading_turnover":38130,"trading_money":16431600000,"foreign_investors":14442,"investment_trust":429,"dealer_self":14,"dealer_hedging":99,"investors_total":14984,"ma5":565.2,"ma10":561.8,"ma20":548.35},{"id":392,"stock_id":"2330","date":"2023-06-13","open":593,"high":594,"low":589,"close":593,"spread":19,"spreadPCT":3.31,"amplitudePCT":0.84,"trading_volume":62672,"trading_turnover":84903,"trading_money":37077400000,"foreign_investors":34284,"investment_trust":-118,"dealer_self":1101,"dealer_hedging":292,"investors_total":35559,"ma5":571.8,"ma10":564.5,"ma20":552.75},{"id":393,"stock_id":"2330","date":"2023-06-14","open":590,"high":591,"low":587,"close":590,"spread":-3,"spreadPCT":-0.51,"amplitudePCT":0.68,"trading_volume":25982,"trading_turnover":28171,"trading_money":15311600000,"foreign_investors":1726,"investment_trust":-72,"dealer_self":560,"dealer_hedging":-48,"investors_total":2166,"ma5":576.2,"ma10":567.7,"ma20":556.3}];
const taiexInfo = [{"id":1,"date":"2023-06-01","open":16511,"high":16555,"low":16477,"close":16512,"ma5":16570.6,"ma10":16384.6,"ma20":16036.45},{"id":2,"date":"2023-06-02","open":16525,"high":16752,"low":16525,"close":16706,"ma5":16610.8,"ma10":16437.8,"ma20":16090.45},{"id":3,"date":"2023-06-05","open":16714,"high":16781,"low":16703,"close":16714,"ma5":16626.4,"ma10":16491.2,"ma20":16141.2},{"id":4,"date":"2023-06-06","open":16712,"high":16793,"low":16699,"close":16761,"ma5":16654.2,"ma10":16548.5,"ma20":16192.9},{"id":5,"date":"2023-06-07","open":16771,"high":16922,"low":16771,"close":16922,"ma5":16723,"ma10":16624.8,"ma20":16256.95},{"id":6,"date":"2023-06-08","open":16864,"high":16899,"low":16694,"close":16733,"ma5":16767.2,"ma10":16668.9,"ma20":16317.9},{"id":7,"date":"2023-06-09","open":16775,"high":16895,"low":16775,"close":16886,"ma5":16803.2,"ma10":16707,"ma20":16387.1},{"id":8,"date":"2023-06-12","open":16899,"high":16999,"low":16899,"close":16955,"ma5":16851.4,"ma10":16738.9,"ma20":16461.1},{"id":9,"date":"2023-06-13","open":17135,"high":17254,"low":17129,"close":17216,"ma5":16942.4,"ma10":16798.3,"ma20":16538.25},{"id":10,"date":"2023-06-14","open":17190,"high":17259,"low":17182,"close":17238,"ma5":17005.6,"ma10":16864.3,"ma20":16603.9}];
const type = "long";

let position = 'none';

// You can use Stock, preStock, taiex, preTaiex these object
let shares = 0;
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
const close = stock.close;
const preClose = preStock.close;
const open = stock.open;
const preMa5 = preStock.ma5;
const ma5 = stock.ma5;

const con1 = preClose > preMa5;
const con2 = close < ma5;

if (position === 'none' && con1) {
  action['buy'](open,1);
  position = 'trade';
}
if (position === 'trade' && con2) {
  action['sell'](close,1);
  position = 'none';
}

const isLastDay = i + 1  === stockInfo.length;
if (isLastDay && shares > 0) {
  action['sell'](stock.close, shares);
}
}
console.log(JSON.stringify({transactions}));
