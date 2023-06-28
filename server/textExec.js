const stockInfo = [{"id":384,"stock_id":"2330","open":550,"high":554,"low":550,"close":551,"spread":-7,"spreadPCT":-1.25,"amplitudePCT":0.73,"trading_volume":25258,"trading_turnover":25441,"trading_money":13920800000,"foreign_investors":-2903,"investment_trust":142,"dealer_self":169,"dealer_hedging":126,"investors_total":-2466,"date":"2023-06-01","ma5":561.8,"ma10":547,"ma20":526.6,"ma60":520.05,"ma120":507.46666666666664},{"id":385,"stock_id":"2330","open":559,"high":564,"low":557,"close":562,"spread":11,"spreadPCT":2,"amplitudePCT":1.25,"trading_volume":34705,"trading_turnover":30644,"trading_money":19460100000,"foreign_investors":8372,"investment_trust":167,"dealer_self":-59,"dealer_hedging":96,"investors_total":8576,"date":"2023-06-02","ma5":561,"ma10":550,"ma20":529.7,"ma60":520.7333333333333,"ma120":508},{"id":386,"stock_id":"2330","open":560,"high":560,"low":555,"close":555,"spread":-7,"spreadPCT":-1.25,"amplitudePCT":0.9,"trading_volume":17484,"trading_turnover":20211,"trading_money":9730880000,"foreign_investors":-2493,"investment_trust":-300,"dealer_self":-54,"dealer_hedging":-191,"investors_total":-3038,"date":"2023-06-05","ma5":558.4,"ma10":552.4,"ma20":532.25,"ma60":521.25,"ma120":508.6166666666667},{"id":387,"stock_id":"2330","open":554,"high":562,"low":553,"close":560,"spread":5,"spreadPCT":0.9,"amplitudePCT":1.61,"trading_volume":21562,"trading_turnover":15551,"trading_money":12043600000,"foreign_investors":3149,"investment_trust":-342,"dealer_self":47,"dealer_hedging":346,"investors_total":3200,"date":"2023-06-06","ma5":557.2,"ma10":555.4,"ma20":534.75,"ma60":521.9,"ma120":509.225},{"id":388,"stock_id":"2330","open":561,"high":568,"low":560,"close":568,"spread":8,"spreadPCT":1.43,"amplitudePCT":1.41,"trading_volume":29092,"trading_turnover":29548,"trading_money":16449300000,"foreign_investors":7436,"investment_trust":1451,"dealer_self":202,"dealer_hedging":137,"investors_total":9226,"date":"2023-06-07","ma5":559.2,"ma10":559.7,"ma20":538,"ma60":522.6666666666666,"ma120":509.875},{"id":389,"stock_id":"2330","open":562,"high":568,"low":555,"close":559,"spread":-9,"spreadPCT":-1.58,"amplitudePCT":2.33,"trading_volume":25251,"trading_turnover":27238,"trading_money":14190400000,"foreign_investors":-3260,"investment_trust":-233,"dealer_self":-206,"dealer_hedging":-66,"investors_total":-3765,"date":"2023-06-08","ma5":560.8,"ma10":561.3,"ma20":541,"ma60":523.4333333333333,"ma120":510.375},{"id":390,"stock_id":"2330","open":561,"high":566,"low":561,"close":565,"spread":6,"spreadPCT":1.07,"amplitudePCT":0.88,"trading_volume":19776,"trading_turnover":16713,"trading_money":11160700000,"foreign_investors":5015,"investment_trust":-106,"dealer_self":181,"dealer_hedging":246,"investors_total":5336,"date":"2023-06-09","ma5":561.4,"ma10":561.2,"ma20":544.45,"ma60":524.25,"ma120":510.975},{"id":391,"stock_id":"2330","open":574,"high":574,"low":571,"close":574,"spread":9,"spreadPCT":1.59,"amplitudePCT":0.52,"trading_volume":28657,"trading_turnover":38130,"trading_money":16431600000,"foreign_investors":14442,"investment_trust":429,"dealer_self":14,"dealer_hedging":99,"investors_total":14984,"date":"2023-06-12","ma5":565.2,"ma10":561.8,"ma20":548.35,"ma60":525.3166666666667,"ma120":511.68333333333334},{"id":392,"stock_id":"2330","open":593,"high":594,"low":589,"close":593,"spread":19,"spreadPCT":3.31,"amplitudePCT":0.84,"trading_volume":62672,"trading_turnover":84903,"trading_money":37077400000,"foreign_investors":34284,"investment_trust":-118,"dealer_self":1101,"dealer_hedging":292,"investors_total":35559,"date":"2023-06-13","ma5":571.8,"ma10":564.5,"ma20":552.75,"ma60":526.6833333333333,"ma120":512.6416666666667},{"id":393,"stock_id":"2330","open":590,"high":591,"low":587,"close":590,"spread":-3,"spreadPCT":-0.51,"amplitudePCT":0.68,"trading_volume":25982,"trading_turnover":28171,"trading_money":15311600000,"foreign_investors":1726,"investment_trust":-72,"dealer_self":560,"dealer_hedging":-48,"investors_total":2166,"date":"2023-06-14","ma5":576.2,"ma10":567.7,"ma20":556.3,"ma60":528.1,"ma120":513.6}];
const taiexInfo = [{"id":1,"open":16511,"high":16555,"low":16477,"close":16512,"date":"2023-06-01","ma5":16570.6,"ma10":16384.6,"ma20":16036.45,"ma60":15801.633333333333,"ma120":15368.241666666667},{"id":2,"open":16525,"high":16752,"low":16525,"close":16706,"date":"2023-06-02","ma5":16610.8,"ma10":16437.8,"ma20":16090.45,"ma60":15817.35,"ma120":15384.308333333332},{"id":3,"open":16714,"high":16781,"low":16703,"close":16714,"date":"2023-06-05","ma5":16626.4,"ma10":16491.2,"ma20":16141.2,"ma60":15831.633333333333,"ma120":15402.291666666666},{"id":4,"open":16712,"high":16793,"low":16699,"close":16761,"date":"2023-06-06","ma5":16654.2,"ma10":16548.5,"ma20":16192.9,"ma60":15847.35,"ma120":15419.391666666666},{"id":5,"open":16771,"high":16922,"low":16771,"close":16922,"date":"2023-06-07","ma5":16723,"ma10":16624.8,"ma20":16256.95,"ma60":15866.55,"ma120":15436.416666666666},{"id":6,"open":16864,"high":16899,"low":16694,"close":16733,"date":"2023-06-08","ma5":16767.2,"ma10":16668.9,"ma20":16317.9,"ma60":15886.666666666666,"ma120":15450.758333333333},{"id":7,"open":16775,"high":16895,"low":16775,"close":16886,"date":"2023-06-09","ma5":16803.2,"ma10":16707,"ma20":16387.1,"ma60":15908.766666666666,"ma120":15466.725},{"id":8,"open":16899,"high":16999,"low":16899,"close":16955,"date":"2023-06-12","ma5":16851.4,"ma10":16738.9,"ma20":16461.1,"ma60":15935.35,"ma120":15483.183333333332},{"id":9,"open":17135,"high":17254,"low":17129,"close":17216,"date":"2023-06-13","ma5":16942.4,"ma10":16798.3,"ma20":16538.25,"ma60":15965.833333333334,"ma120":15503.916666666666},{"id":10,"open":17190,"high":17259,"low":17182,"close":17238,"date":"2023-06-14","ma5":17005.6,"ma10":16864.3,"ma20":16603.9,"ma60":15999.45,"ma120":15525.65}];
const type = "short";
let position = 'none';

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
      type === 'long' ? shares += qty : shares -= qty;
      transactions.push({ date: stock.date, type: 'buy', qty, price });
    },
    sell: (price, qty) => {
      type === 'long' ? shares -= qty: shares += qty;
      transactions.push({ date: stock.date, type: 'sell', qty, price });
      totalTrades++;
    }
  };
// You can use Stock, preStock, taiex, preTaiex these object

const close = stock.close;
const preClose = preStock.close;
const open = stock.open;
const preMa5 = preStock.ma5;
const ma5 = stock.ma5;

const con1 = preClose > preMa5;
const con2 = close < ma5;

if (position === 'none' && con1) {
  action['sell'](open, 1);
  position = 'trade';
}
if (position === 'trade' && con2) {
  action['buy'](close, 1);
  position = 'none';
}

const isLastDay = i + 1  === stockInfo.length;
if (isLastDay && shares !== 0) {
  if (type === 'long'){
    action['sell'](stock.close, shares);
  } else {
    action['buy'](stock.close, shares);
  }
}
}
module.exports = {transactions};
