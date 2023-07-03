import { useState, useRef, useEffect } from "react"
import { LineStyle, createChart } from "lightweight-charts";
import HistogramInScript from "./BarChart";
import Report from "../routes/Report";
import PropTypes from 'prop-types';

export default function ScriptChart({data}){
  
  const chartContainerRef = useRef();
  const [candlePrice, setCandlePrice] = useState(null);
  const [ma5Price, setMa5Price] = useState(null);
  const [ma10Price, setMa10Price] = useState(null);
  const [ma20Price, setMa20Price] = useState(null);
  const [volume, setVolume] = useState(null);

  useEffect(() => {

    if (Object.keys(data).length > 0) {
      const chart = createChart(chartContainerRef.current,{
        autoSize: true,
      }) 
  
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
        time: obj.date,
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

      const volumeData = stockData.map(obj => ({
        time: obj.date,
        value: obj.trading_volume,
        color: obj.spread > 0? 'rgba(38,166,154,0.6)':'rgba(255,38,71,0.6)'
      }));
      
      chart.applyOptions({
        layout: {
          background: { color: '#1D1D1E' },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: '#1D1D1E' },
          horzLines: { color: '#1D1D1E' },
        },
        width: chartContainerRef.current.clientWidth,
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
      
      const ma5LineSeries = chart.addLineSeries();
      const ma10LineSeries = chart.addLineSeries();
      const ma20LineSeries = chart.addLineSeries();
      const candleStickSeries = chart.addCandlestickSeries();

      candleStickSeries.applyOptions({
        wickUpColor: '#26a69a',
        upColor: '#26a69a',
        wickDownColor: '#FF2647',
        downColor: '#FF2647',
        borderVisible: false,
      });

      ma5LineSeries.applyOptions({
        lineWidth: 2,
        color: "#d4c744"
      });

      ma10LineSeries.applyOptions({
        lineWidth: 2,
        color: "#4499d4"
      });

      ma20LineSeries.applyOptions({
        lineWidth: 2,
        color: "#7f44d4"
      });
      candleStickSeries.setData(candleData);
      ma5LineSeries.setData(ma5Data);
      ma10LineSeries.setData(ma10Data);
      ma20LineSeries.setData(ma20Data);

      candleStickSeries.setMarkers(marker);

      const volumeSeries = chart.addHistogramSeries({
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '', // set as an overlay by setting a blank priceScaleId
        // set the positioning of the volume series
        scaleMargins: {
          top: 0.7, // highest point of the series will be 70% away from the top
          bottom: 0,
        },
      });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.7, // highest point of the series will be 70% away from the top
          bottom: 0,
        },
      });
      volumeSeries.setData(volumeData);

      chart.subscribeCrosshairMove((param) => {
        if (param.time) {
          const candleData = param.seriesData.get(candleStickSeries);
          setCandlePrice(candleData);
          const ma5Data = param.seriesData.get(ma5LineSeries);
          setMa5Price(ma5Data);
          const ma10Data = param.seriesData.get(ma10LineSeries);
          setMa10Price(ma10Data);
          const ma20Data = param.seriesData.get(ma20LineSeries);
          setMa20Price(ma20Data);
          const volume = param.seriesData.get(volumeSeries);
          setVolume(volume);
        }
      });

      //直接fit
      chart.timeScale().fitContent();

      const handleResize = () => {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      };
      window.addEventListener("resize",handleResize);
  
      return () => {
        chart.remove();
        window.removeEventListener("resize", handleResize);
      };    
    }
  }, [data]);


  return(
    <>
    <div className="h-[calc(100vh-92px)]">
      <div ref={chartContainerRef} style={{position:'relative'}}
        className="bg-[#1D1D1E] border border-[#1D1D1E] rounded-lg h-[60%]">
        { Object.keys(data).length > 0 &&
        <div style={{position:'absolute', top: 3, left: 30, zIndex: 20}}>
          <div className="flex items-center text-[#BABCBC]">
            <div className="text-xl mr-3">{data.candleData[0]?.stock_id}</div>
            <div className="mr-2">
              <span> O </span>
              <span style={{color:candlePrice?.close-candlePrice?.open>=0?'#26a69a':'#FF2647'}}>{candlePrice?.open}</span>
            </div>
            <div className="mr-2">
              <span> H </span>
              <span style={{color:candlePrice?.close-candlePrice?.open>=0?'#26a69a':'#FF2647'}}>{candlePrice?.high}</span>
            </div>
            <div className="mr-2">
              <span> L </span>
              <span style={{color:candlePrice?.close-candlePrice?.open>=0?'#26a69a':'#FF2647'}}>{candlePrice?.low}</span>
            </div>
            <div className="mr-2">
              <span> C </span>
              <span style={{color:candlePrice?.close-candlePrice?.open>=0?'#26a69a':'#FF2647'}}>{candlePrice?.close}</span>
            </div>
            <div className="mr-2">
              <span> V </span>
              <span className="text-[#E7893C]">{volume?.value/1000}</span>
              <span>k</span>
            </div>
          </div>
          <div className="flex text-[#BABCBC]">
            <div className="mr-2">
              <span>m5 </span>
              <span style={{color:"#d4c744"}}>{ma5Price?.value}</span>
            </div>
            <div className="mr-2">
              <span>ma10 </span>
              <span style={{color:"#4499d4"}}>{ma10Price?.value}</span>
            </div>
            <div className="mr-2">
              <span>ma20 </span>
              <span style={{color:"#7f44d4"}}>{ma20Price?.value}</span>
            </div>
          </div>
        </div>
        }
      </div>
      <div id="report-area" className="flex flex-row gap-2 mt-2 justify-center h-[40%]">
        <div className="basis-1/4 bg-[#1D1D1E] text-[#BABABC] rounded-lg pl-2 pr-2 pt-3 place-content-center">
          <Report data={data}/>
        </div>
        <div className="basis-3/4 bg-[#1D1D1E] border border-[#1D1D1E] col-span-2 rounded-lg">
          <HistogramInScript data={data}/>
        </div>
      </div>  
    </div>
    </>
  )
}

ScriptChart.propTypes = {
  data: PropTypes.shape({
    successRate: PropTypes.number,
    totalTradeTimes: PropTypes.number,
    numberOfGains: PropTypes.number,
    numberOfLosses: PropTypes.number,
    totalProfit: PropTypes.number,
    maximumProfit: PropTypes.number,
    maximumLoss: PropTypes.number,
    candleData: PropTypes.array,
    perTrade: PropTypes.array,
  }).isRequired,
};
