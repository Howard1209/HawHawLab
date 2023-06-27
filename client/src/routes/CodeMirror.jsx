import { useState, useRef, useEffect } from "react"
import { LineStyle, createChart } from "lightweight-charts";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import Split from 'react-split'
import HistogramInScript from "../components/BarChart";
import Report from "./Report";
import api from "../utils/api";

const explain = `// 請修改以下 variable 的 value
const startDate = '2023-06-01';
const endDate = '2023-06-14';
const stockId = '2330';
const ma = [5, 10, 20]; // it can not be change, i will fix it soon.
const type = 'long'; // long or short

// 請勿修改下方的code
console.log(JSON.stringify({startDate, endDate, stockId, ma, type}));

// The trigger you want to set up, i can be empty;

// You can use Stock, preStock, taiex, preTaiex these object
// Condition area
`;

export default function Script() {
  const [code, setCode] = useState(explain);
  const [data, setJsonData] = useState({});

  const submitCode = async() => {
    const result = await api.postScript(code);
    if (result.report) {
      setJsonData(result.report);
    }
    console.log(result)
  }

  const chartContainerRef = useRef();
  const [candlePrice, setCandlePrice] = useState(null);
  const [ma5Price, setMa5Price] = useState(null);
  const [ma10Price, setMa10Price] = useState(null);
  const [ma20Price, setMa20Price] = useState(null);

  useEffect(() => {

    if (Object.keys(data).length > 0) {
      const chart = createChart(chartContainerRef.current, {
        autoSize: true,
        layout: {
          background: { color: '#222' },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' },
        },
        crosshair: {
          vertLine: {
              width: 5,
              color: '#C3BCDB44',
              style: LineStyle.Solid,
              labelBackgroundColor: '#9B7DFF',
          },
          horzLine: {
            color: '#9B7DFF',
            labelBackgroundColor: '#9B7DFF',
          },
        },
      });
  
      const stockData = data.candleData;
      const tradeData = data.perTrade;

      const marker = tradeData.map(trade => {
        const markerObj = {
          time: trade.date,
          position: trade.type === 'buy' ? 'belowBar' : 'aboveBar',
          color: trade.type === 'buy' ? '#2196F3' : '#e91e63',
          shape: trade.type === 'buy' ? 'arrowUp' : 'arrowDown',
          text: trade.type === 'buy' ? `Buy ${trade.price}` : `Sell ${trade.price}`,
          size: 0.8,
        };
        return markerObj;
      });
      
      const candleData = stockData.map(obj => ({
        open: obj.open,
        high: obj.high,
        low: obj.low,
        close: obj.close,
        time: obj.date
      }));

      const ma5Data = stockData.map(obj => ({
        time: obj.date,
        value: obj.ma5
      }));

      const ma10Data = stockData.map(obj => ({
        time: obj.date,
        value: obj.ma10
      }));

      const ma20Data = stockData.map(obj => ({
        time: obj.date,
        value: obj.ma20
      }));
      
      // Setting the border color for the vertical axis
      chart.priceScale("right").applyOptions({
        borderColor: '#71649C',
      });

      // Setting the border color for the horizontal axis
      chart.timeScale().applyOptions({
        borderColor: '#71649C',
        timeVisible: true,
        // 右邊要空幾天
        rightOffset: 2,
        barSpacing: 15,
        minBarSpacing: 5,
        // 讓左側不要空
        fixLeftEdge: false
      });
      
      //直接fit
      chart.timeScale().fitContent();

      const ma5LineSeries = chart.addLineSeries();
      const ma10LineSeries = chart.addLineSeries();
      const ma20LineSeries = chart.addLineSeries();
      const candleStickSeries = chart.addCandlestickSeries();

      candleStickSeries.applyOptions({
        wickUpColor: '#26a69a',
        upColor: '#26a69a',
        wickDownColor: '#ef5350',
        downColor: '#ef5350',
        borderVisible: false,
      });

      ma5LineSeries.applyOptions({
        lineWidth: 2,
        color: "#baad2b"
      });

      ma10LineSeries.applyOptions({
        lineWidth: 2,
        color: "#2b80ba"
      });

      ma20LineSeries.applyOptions({
        lineWidth: 2,
        color: "purple"
      });
      candleStickSeries.setData(candleData);
      ma5LineSeries.setData(ma5Data);
      ma10LineSeries.setData(ma10Data);
      ma20LineSeries.setData(ma20Data);

      candleStickSeries.setMarkers(marker);

      chart.subscribeCrosshairMove((param) => {
        if (param.time) {
          const data = param.seriesData.get(candleStickSeries);
          setCandlePrice(data);
          const ma5Data = param.seriesData.get(ma5LineSeries);
          setMa5Price(ma5Data);
          const ma10Data = param.seriesData.get(ma10LineSeries);
          setMa10Price(ma10Data);
          const ma20Data = param.seriesData.get(ma20LineSeries);
          setMa20Price(ma20Data);
        }
      });
      return () => {
        chart.remove();
      };    
    }
  }, [data]);

  return (
    <>
    <div className="bg-gray-300 min-h-screen">
      <Split
          sizes={[40, 60]}
          className="split"
          minSize={50}
      >
        <div id="codeMirror-area" className=" min-h-screen">
          <CodeMirror
            value={code}
            height="866px"
            theme={vscodeDark}
            extensions={[javascript()]}
            onChange={(value) => setCode(value)}
          />
          <div className="border-2 bg-green-500 text-center" onClick={submitCode}>Start Backtesting</div>
        </div>
        <div id="chart-area">
          <p className=" mb-3 ">Backtesting Report</p>
          <div ref={chartContainerRef} style={{position:'relative', height:'470px'}} className="ml-2 mr-2 border-2 border-gray-500 rounded-lg">
          { Object.keys(data).length > 0 &&
            <div style={{
              position:'absolute', top: 10, left: 30, zIndex: 20, color: 'white'
              }}>
              <div>{data.candleData[0]?.stock_id}</div>
              <div className="flex">
                <div className="mr-2">open: {candlePrice?.open}</div>
                <div className="mr-2">close: {candlePrice?.close}</div>
                <div className="mr-2">hugh: {candlePrice?.high}</div>
                <div className="mr-2">low: {candlePrice?.low}</div>
              </div>
              <div className="flex">
                <div className="mr-2">ma5: {ma5Price?.value}</div>
                <div className="mr-2">ma10: {ma10Price?.value}</div>
                <div className="mr-2">ma20: {ma20Price?.value}</div>
              </div>
            </div>
          }
          </div>
          <div id="report-area" className="grid grid-cols-3 gap-3 h-[376px] mt-2">
            <div className=" border-2 border-blue-500 rounded-lg ml-2 pl-2 pr-2 pt-3 place-content-center">
              <Report data={data}/>
            </div>
            <div className="border-2 border-blue-500 col-span-2 rounded-lg mr-2">
              <HistogramInScript data={data}/>
            </div>
          </div>  
        </div>
      </Split>
    </div>
    </>
  );
}
