import { useState, useRef } from "react"
import PostStrategy from "../components/components";

export default function Backtesting() {
  const [jsonData, setData] = useState({});

  const chartContainerRef = useRef();

  const renderChart = (data) => {
    console.log(data.perTrade);
    setData(data);
    
    const chart = createChart(chartContainerRef.current);

  }

  return (
    <>
      <div id="backtesting-container" className="border border-red-500 min-h-screen grid grid-cols-3" >
        <div className="form border-2 border-red-300 min-h-screen col-span-1">
          <form id="backtesting-form">
            <h1>Test your strategy</h1>
            <input
              id="startDate"
              aria-label="Search contacts"
              placeholder="Stock id"
              type="search"
              name="startDate"
            />
          </form>
          <PostStrategy renderChart={renderChart} />
        </div>
        <div className="chart border-2 border-blue-500 min-w-full col-span-2 grid grid-rows-2">
          <p className=" mb-3">chart area  待補上</p>
          <div id="report area grid grid-cols-2">
              <div className="chart border-2 border-blue-500 min-w-full col-span-2">
                <p>Success rate: {jsonData?.successRate}%</p>
                <p>Total trade times: {jsonData?.totalTradeTimes}</p>
                <p>Gain times: {jsonData?.numberOfGains}</p>
                <p>Loss times: {jsonData?.numberOfLosses}</p>
                <p>Total profit: {jsonData?.totalProfit}</p>
                <p>Maximum Profit: {jsonData?.maximumProfit}</p>
                <p>Maximum Loss: {jsonData?.maximumLoss}</p>
              </div>
              <div>
                <p>line chart</p>
              </div>
          </div>  
        </div>
      </div>
      
    </>
  );
}