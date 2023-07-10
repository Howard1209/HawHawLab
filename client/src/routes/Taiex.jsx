import { LineStyle, createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { useOutletContext } from 'react-router-dom';
import api from "../utils/api";

function TaiexChart() {
  const [open] = useOutletContext();

  const chartContainerRef = useRef();
  const chartRef = useRef();
  const [candlePrice, setCandlePrice] = useState(null);
  const [ma5Price, setMa5Price] = useState(null);
  const [ma10Price, setMa10Price] = useState(null);
  const [ma20Price, setMa20Price] = useState(null);
  
  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current); 
    const chart = chartRef.current;

    api.getTaiexData().then(result => {

      const taiexData = result.adjTaiexData;

      const candleData = taiexData.map(obj => ({
        open: obj.open,
        high: obj.high,
        low: obj.low,
        close: obj.close,
        time: obj.time
      }));
      
      const ma5Data = taiexData.map(obj => ({
        time: obj.time,
        value: obj[5]
      }));

      const ma10Data = taiexData.map(obj => ({
        time: obj.time,
        value: obj[10]
      }));

      const ma20Data = taiexData.map(obj => ({
        time: obj.time,
        value: obj[20]
      }));

      chart.applyOptions({
        layout: {
          background: { color: '#222' },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
        crosshair: {
          // Vertical crosshair line (showing Date in Label)
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
        rightOffset: 3,
        barSpacing: 15,
        minBarSpacing: 5,
        fixLeftEdge: true
      });

      //直接fit
      // chart.timeScale().fitContent();

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
  
    });

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
  }, [])

  useEffect(() => {
    const handleResize = () => {
      chartRef.current.applyOptions({
        width: open ? chartContainerRef.current.clientWidth : chartContainerRef.current.clientWidth+124,
      });
    };
    handleResize();
  }, [open])

  return (
    <>
      <h1 className="text-3xl font-bold mt-3 text-center text-[#BABCBC]">
      The TAIEX over the past year.
      </h1>
      <div ref={chartContainerRef} style={{position:'relative'}} className="mt-3">
        <div style={{
          position:'absolute', top: 10, left: 30, zIndex: 20, color: 'white'
          }}>
            <div>TAIEX</div>
            <div className="flex">
              <div className="mr-2">open: {candlePrice?.open}</div>
              <div className="mr-2">open: {candlePrice?.close}</div>
              <div className="mr-2">open: {candlePrice?.high}</div>
              <div className="mr-2">open: {candlePrice?.low}</div>
            </div>
            <div className="flex">
              <div className="mr-2">ma5: {ma5Price?.value}</div>
              <div className="mr-2">ma10: {ma10Price?.value}</div>
              <div className="mr-2">ma20: {ma20Price?.value}</div>
            </div>
          </div>
      </div>
    </>
  )
}

export default TaiexChart
