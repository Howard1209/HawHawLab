import { useState, useRef, useEffect } from "react"
import { LineStyle, createChart } from "lightweight-charts";
import { useSetRecoilState } from 'recoil';
import { loginBtnState } from '../atom/Atom';
import { useNavigate } from 'react-router-dom';
import Split from 'react-split'
import StrategyFrom from "../components/Form";
import Histogram from "./Histogram";
import Report from "./Report";

export default function Backtesting() {
  const [data, setJsonData] = useState({});
  const setIsShowing = useSetRecoilState(loginBtnState);
  const navigate = useNavigate();

  const chartContainerRef = useRef();
  const [candlePrice, setCandlePrice] = useState(null);
  const [ma5Price, setMa5Price] = useState(null);
  const [ma10Price, setMa10Price] = useState(null);
  const [ma20Price, setMa20Price] = useState(null);
  const renderChart = (data) => setJsonData(data);

  useEffect(() => {
    const jwtToken = window.localStorage.getItem('access_token');
    if (!jwtToken) {
      setIsShowing(true);
      navigate('/');
      return
    }

    if (Object.keys(data).length > 0) {
      const chart = createChart(chartContainerRef.current, {
        autoSize: true,
        layout: {
          background: { color: '#1d1d1e' },
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

      const marker = [];
      
      for (let i = 0; i < tradeData.length; i++) {
        marker.push({
          time: tradeData[i].openDay,
          position: 'belowBar',
          color: '#2196F3',
          shape: 'arrowUp',
          text: `Buy ${tradeData[i].openPrice}`,
          size: 0.8,
        });
        marker.push({
          time: tradeData[i].closeDay,
          position: 'aboveBar',
          color: '#e91e63',
          shape: 'arrowDown',
          text: `Sell ${tradeData[i].closePrice}`,
          size: 0.8,
        });
      }
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
  }, [data, navigate, setIsShowing]);
  

  return (
    <>
    <div id="backtesting-container" className="mt-2 rounded-md h-[calc(100vh-56px)] text-[#BABCBC]">
      <Split
        sizes={[30, 70]}
        className="split"
        minSize={50}
      > 
        <div className="form-area ml-1 bg-[#1D1D1E] rounded-lg pl-1">
          <StrategyFrom renderChart={renderChart}/>
        </div>
        <div className="min-w-[350px] h-[calc(100vh-56px)] max-w-full overflow-auto">
          <div ref={chartContainerRef} style={{position:'relative'}} className="h-[65%] mr-2 bg-[#1d1d1e] border border-[#1d1d1e] rounded-lg">
          { Object.keys(data).length > 0 &&
            <div style={{
              position:'absolute', top: 10, left: 30, zIndex: 20, color: 'white'
              }}>
              <div>{data.candleData[0]?.stock_id}</div>
              <div className="flex">
                <div className="mr-2">open: {candlePrice?.open}</div>
                <div className="mr-2">close: {candlePrice?.close}</div>
                <div className="mr-2">high: {candlePrice?.high}</div>
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
          <div id="report-area" className="grid grid-cols-3 gap-3 mt-2 min-h-[35%]">
            <div className="bg-[#1d1d1e] rounded-lg pl-2 pr-2 pt-3 place-content-center text-sm">
              <Report data={data}/>
            </div>
            <div className="bg-[#1d1d1e] col-span-2 rounded-lg mr-2">
              <Histogram data={data}/>
            </div>
          </div>  
        </div>
      </Split>
    </div>
    </>
  );
}
