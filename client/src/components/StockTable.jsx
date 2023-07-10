
import { useState, useRef, useEffect } from "react"
import { LineStyle, createChart } from "lightweight-charts";


export function StockChart({stockData}) {
  const chartContainerRef = useRef();
  const [candlePrice, setCandlePrice] = useState(null);
  const [ma5Price, setMa5Price] = useState(null);
  const [ma10Price, setMa10Price] = useState(null);
  const [ma20Price, setMa20Price] = useState(null);
  const [volume, setVolume] = useState(null);

  function reverseArray(array) {
    const reversedArray = [];
    for (var i = array.length - 1; i >= 0; i--) {
      reversedArray.push(array[i]);
    }
    return reversedArray;
  }

  useEffect(()=>{
    const chart = createChart(chartContainerRef.current,{
      autoSize: true,
    });
    const adjStockData = reverseArray(stockData);
    const candleData = adjStockData.map(obj => ({
      open: obj.open,
      high: obj.high,
      low: obj.low,
      close: obj.close,
      time: obj.date,
    }));

    const ma5Data = adjStockData.map(obj => ({
      time: obj.date,
      value: Math.round(obj.ma5*100)/100,
    }));

    const ma10Data = adjStockData.map(obj => ({
      time: obj.date,
      value: Math.round(obj.ma10*100)/100
    }));

    const ma20Data = adjStockData.map(obj => ({
      time: obj.date,
      value: Math.round(obj.ma20*100)/100
    }));

    const volumeData = adjStockData.map(obj => ({
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
      timeVisible: false,
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
  },[stockData])

  return(
    <div ref={chartContainerRef} style={{position:'relative'}}
      className="bg-[#1D1D1E] border border-[#1D1D1E] rounded-md h-[100%]">
      <div style={{position:'absolute', top: 3, left: 30, zIndex: 20}}>
        <div className="flex items-center text-[#BABCBC]">
          <div className="text-xl mr-3">{stockData[0]?.stock_id}</div>
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
            <span className="text-[#E7893C]">{volume?.value/1000}k</span>
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
    </div>
  )
}

export function StockTable({stockData}) {

  return(
    <div className="block overflow-auto h-full text-xs border border-[#1D1D1E] rounded-md">
      <table className="h-full text-center w-full">
        <thead className="sticky top-0 h-6 rounded-md font-medium w-full bg-[#1D1D1E]">
          <th scope="col">Date</th>
          <th scope="col">Open</th>
          <th scope="col">High</th>
          <th scope="col">Low</th>
          <th scope="col">Close</th>
          <th scope="col">Spread</th>
          <th scope="col">Spread %</th>
          <th scope="col">Volume</th>
        </thead>
        <tbody className="w-full">
          { stockData.map((stock, i) => ( 
          <tr key={i} className="bg-[#343435] h-6 text-center w-full border-t border-[#434344]">
            <td className={`px-4`}>{stock?.date}</td>
            <td className="px-4">{stock?.open}</td>
            <td className="px-4">{stock?.high}</td>
            <td className="px-4">{stock?.low}</td>
            <td className="px-4">{stock?.close}</td>
            <td className={`px-4 ${stock?.spread < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.spread}</td>
            <td className={`px-4 ${stock?.spread < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.spreadPCT}%</td>
            <td className="px-4">{stock?.trading_volume}</td>
          </tr> 
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function InvestorTable({stockData}) {
  return(
    <div className="block overflow-auto h-full border border-[#1D1D1E] rounded-md text-xs">
      <table className="h-full w-full text-center">
        <thead className="w-full sticky top-0 h-6 rounded-md font-medium">
          <th scope="col" className="bg-[#1D1D1E]">Date</th>
          <th scope="col" className="px-4 bg-[#1D1D1E]">Foreign Investors</th>
          <th scope="col" className="px-4 bg-[#1D1D1E]">Investment Trust</th>
          <th scope="col" className="px-4 bg-[#1D1D1E]">Dealer Self</th>
          <th scope="col" className="px-4 bg-[#1D1D1E]">Dealer Hedging</th>
          <th scope="col" className="px-4 bg-[#1D1D1E]">Total</th>
        </thead>
        <tbody className="w-full">
          { stockData.map((stock, i) => ( 
          <tr key={i} className="w-full bg-[#343435] h-6 text-center border-t border-[#434344]">
            <td className={`px-5`}>{stock?.date}</td>
            <td className={`px-4 ${stock?.foreign_investors < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.foreign_investors}</td>
            <td className={`px-4 ${stock?.investment_trust < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.investment_trust}</td>
            <td className={`px-4 ${stock?.dealer_self < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.dealer_self}</td>
            <td className={`px-4 ${stock?.dealer_hedging < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.dealer_hedging}</td>
            <td className={`px-4 ${stock?.investors_total < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.investors_total}</td>
          </tr> 
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StockTable;
