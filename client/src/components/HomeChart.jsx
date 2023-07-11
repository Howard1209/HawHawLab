import { LineStyle, createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { useOutletContext  } from "react-router-dom";
import api from "../utils/api";

export function HomeChart() {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  const [open] = useOutletContext();

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
        time: obj.date
      }));
      
      const ma5Data = taiexData.map(obj => ({
        time: obj.date,
        value: obj.ma5
      }));

      const ma10Data = taiexData.map(obj => ({
        time: obj.date,
        value: obj.ma10
      }));

      const ma20Data = taiexData.map(obj => ({
        time: obj.date,
        value: obj.ma20
      }));

      chart.applyOptions({
        layout: {
          background: { color: '#141415' },
          textColor: '#DDD',
        },
        grid: {
          vertLines: { color: '#141415' },
          horzLines: { color: '#141415' },
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
        rightOffset: 1,
        barSpacing: 15,
        minBarSpacing: 5,
        fixLeftEdge: true
      });
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
        width: open ? chartContainerRef.current.clientWidth-64 : chartContainerRef.current.clientWidth+64,
      });
    };
    handleResize();
  }, [open])

  return (
    <>
      <div ref={chartContainerRef} style={{position:'relative'}} className="opacity-60 rounded-xl">
      </div>
    </>
  )
}

export default HomeChart
