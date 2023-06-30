import { useState, useRef, useEffect } from "react"
import { LineStyle, createChart } from "lightweight-charts";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import Split from 'react-split';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HistogramInScript from "../components/BarChart";
import Report from "./Report";
import api from "../utils/api";

const explain = `// 請修改以下 variable 的 value
const startDate = '2023-06-01';
const endDate = '2023-06-14';
const stockId = '2330';
const ma = [5, 10, 20];
const kd = true; // setting period = 9;
const type = 'long'; // long or short

// Do not revise module.exports
module.exports = {startDate, endDate, stockId, ma, type, kd};

// The trigger you want to set up, it can be empty;

// You can use Stock, preStock, taiex, preTaiex these object
// Condition area
`;

export default function Script() {
  const [code, setCode] = useState(explain);
  const [data, setJsonData] = useState({});

  const submitCode = async() => {
    const result = await api.postScript(code);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setJsonData(result.report);
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
      <div className="mt-2 border border-[#1D1D1E] rounded-md">
        <Split
            sizes={[23, 77]}
            className="split h-[calc(100vh-56px)]"
            minSize={50}
        >
          <div id="codeMirror-area">
            <div className="h-[calc(85%s)]">
              <CodeMirror
                value={code}
                theme={vscodeDark}
                height="580px"
                extensions={[javascript()]}
                onChange={(value) => setCode(value)}
                className="text-sm"
              />
            </div>
            <div className="mt-5 flex">
              <button
                type="button"
                onClick={submitCode}
                className="bg-[#343435] cursor-pointer text-[#E7893C] hover:text-[#30DEAB]
                  px-2 py-1 text-center mx-auto rounded-xl transition-all hover:scale-105">
                  Start Backtesting
              </button>
            </div>
          </div>
          <div id="chart-area" className="border border-red-300 text-[#EEE]">
            <p className="pl-3">Backtesting Report</p>
            <div ref={chartContainerRef} style={{position:'relative'}} className=" mx-2 border border-[#BABABC] rounded-lg h-[55%]">
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
            <div id="report-area" className="grid grid-cols-3 gap-2 mt-2 h-[40%]">
              <div className=" border border-[#BABABC] rounded-lg ml-2 pl-2 pr-2 pt-3 place-content-center">
                <Report data={data}/>
              </div>
              <div className="border border-[#BABABC] col-span-2 rounded-lg mr-2">
                <HistogramInScript data={data}/>
              </div>
            </div>  
          </div>
        </Split>
      </div>
      <div ref={chartContainerRef} style={{position:'relative'}} className=" mx-2 border border-[#BABABC] rounded-lg h-[55%]">
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
      <div id="report-area" className="grid grid-cols-3 gap-2 mt-2 h-[40%]">
        <div className=" border border-[#BABABC] rounded-lg ml-2 pl-2 pr-2 pt-3 place-content-center">
          <Report data={data}/>
        </div>
        <div className="border border-[#BABABC] col-span-2 rounded-lg mr-2">
          <HistogramInScript data={data}/>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
