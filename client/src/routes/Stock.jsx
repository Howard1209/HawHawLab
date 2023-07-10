import { LineStyle, createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from "../utils/api";
import { StockTable, InvestorTable, StockChart } from "../components/StockTable";

function Stock() {
  // const navigate = useNavigate();
  // const navigateStrategy = () => { navigate('/strategy') };
  const [stockList, setStockList] = useState([]);
  const [stockData, setStockData] = useState([]);
  const getStockList = async() => {
    const result = await api.getStockList();
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setStockList(result.data)
  }

  const getStockDetail = async(id) => {
    const result = await api.getStockDetailData(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setStockData(result.data.reverse());
  }
  
  useEffect(() => {
    getStockList();
    getStockDetail('2330');
  },[])

  return (
    <>
    <div className="text-[#EEE] h-[calc(100vh-48px)] w-full flex grid-flow-col">
      <div className="w-[46%]">
        <div className="w-full h-[50%] block overflow-auto border border-[#1D1D1E] rounded-md">
          <table className="w-full mt-2 rounded-md" cellSpacing="0">
            <caption className="caption-top">
              Last update : yesterday
            </caption>
            <thead className="sticky top-0">
              <tr>
                <th scope="col" className="text-sm text-center font-medium border-[#434344] border-l first:border-l-0  bg-[#1D1D1E]">Stock Id</th>
                <th scope="col" className="text-sm text-center font-medium border-[#434344] border-l first:border-l-0  bg-[#1D1D1E]">Open</th>
                <th scope="col" className="text-sm text-center font-medium border-[#434344] border-l first:border-l-0  bg-[#1D1D1E]">High</th>
                <th scope="col" className="text-sm text-center font-medium border-[#434344] border-l first:border-l-0  bg-[#1D1D1E]">Low</th>
                <th scope="col" className="text-sm text-center font-medium border-[#434344] border-l first:border-l-0  bg-[#1D1D1E]">Close</th>
                <th scope="col" className="text-sm text-center font-medium border-[#434344] border-l first:border-l-0  bg-[#1D1D1E]">Spread</th>
                <th scope="col" className="text-sm text-center font-medium border-[#434344] border-l first:border-l-0  bg-[#1D1D1E]">Spread %</th>
                <th scope="col" className="text-sm text-center font-medium border-[#434344] border-l first:border-l-0  bg-[#1D1D1E]">Volume</th>
              </tr>
            </thead>
            <tbody>
              { stockList.map((stock, i) => (
              <tr key={i} className="bg-[#343435] h- text-sm text-center">
                <td className={`w-fit cursor-pointer text-sm text-center border-t border-l first:border-l-0 border-[#434344]
                `}
                onClick={()=> getStockDetail(stock?.stock_id)}
                >{stock?.stock_id}</td>
                <td className="">{stock?.open}</td>
                <td className="">{stock?.high}</td>
                <td className="">{stock?.low}</td>
                <td className="">{stock?.close}</td>
                <td className={`${stock?.spread < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.spread}</td>
                <td className={`${stock?.spread < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.spreadPCT}</td>
                <td className="">{stock?.trading_volume}</td>
              </tr> 
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-[50%] py-1">
          <StockTable stockData={stockData} />
        </div>
      </div>
      <div className="w-[54%]">
        <div className="h-[60%] pt-2 py-1 px-1">
          <StockChart stockData={stockData} />
        </div>
        <div className="h-[40%] px-1 pb-1">
          <InvestorTable stockData={stockData}/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Stock
