import { LineStyle, createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import Button from "./conponments/Button";

function App() {
  const chartContainerRef = useRef();
  // const [data, setData] = useState([]);
  const [candlePrice, setCandlePrice] = useState(null);


  // console.log(data);

  useEffect(() => {
    const chart = createChart(chartContainerRef.current); 

    // api.postData().then(result => {
      // setData(result);
      // const initialData = result;
    const initialData = [
      { time: '2017-01-17', open: 10, high: 10.63, low: 9.49, close: 9.55 },
      { open: 9.55, high: 10.30, low: 9.42, close: 9.94, time: '2017-01-18' },
      { open: 9.94, high: 10.17, low: 9.92, close: 9.78, time: '2017-01-19' },
      { open: 9.78, high: 10.59, low: 9.18, close: 9.51, time: '2017-01-20' },
      { open: 9.51, high: 10.46, low: 9.10, close: 10.17, time: '2017-01-21' },
      { open: 10.17, high: 10.96, low: 10.16, close: 10.47, time: '2017-01-22' },
      { open: 10.47, high: 11.39, low: 10.40, close: 10.81, time: '2017-01-23' },
      { open: 10.81, high: 11.60, low: 10.30, close: 10.75, time: '2017-01-24' }, 
      { open: 10.75, high: 11.60, low: 10.49, close: 10.93, time: '2017-01-25' },
      { open: 10.93, high: 11.53, low: 10.76, close: 10.96, time: '2017-01-26' }
    ];
    
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
      timeVisible: true,
      // 右邊要空幾天
      rightOffset: 10,
      barSpacing: 15,
      minBarSpacing: 5,
      // 讓左側不要空
      // fixLeftEdge: true
    });

    //直接fit
    // chart.timeScale().fitContent();

    const candleStickSeries = chart.addCandlestickSeries();
    
    candleStickSeries.applyOptions({
      wickUpColor: 'rgb(54, 116, 217)',
      upColor: 'rgb(54, 116, 217)',
      wickDownColor: 'rgb(225, 50, 85)',
      downColor: 'rgb(225, 50, 85)',
      borderVisible: false,
    });

    candleStickSeries.setData(initialData);
  

    // });

    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(candleStickSeries);
        setCandlePrice(data);
      }
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

  return (
    <>
      <h1 className="text-3xl font-bold">
        Welcome to HawHawLab!
      </h1>
      <div ref={chartContainerRef} style={{position:'relative'}}>
        <div style={{
          position:'absolute', top: 10, left: 30, zIndex: 20, color: 'white'
          }}>
            <div>2330 台積電</div>
            <div className="flex">
              <div className="mr-2">open: {candlePrice?.open}</div>
              <div className="mr-2">open: {candlePrice?.close}</div>
              <div className="mr-2">open: {candlePrice?.high}</div>
              <div className="mr-2">open: {candlePrice?.low}</div>
            </div>
          </div>
      </div>
      <Button />
    </>
  )
}

export default App
