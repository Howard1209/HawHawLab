import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import api from "../utils/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StockTable, InvestorTable, StockChart } from "../components/StockTable";

function Stock() {
  const [stockList, setStockList] = useState([]);
  const [stockId, setStockId] = useState('2330')
  const [stockData, setStockData] = useState([]);
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  const currentDate = new Date();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(currentDate.getDate() - 1);

  const getStockList = async() => {
    const result = await api.getStockList();
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setStockList(result.data)
  };

  const getStockDetail = async(id) => {
    navigate(`/stock?stockId=${id}`)

    const result = await api.getStockDetailData(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setStockId(id);
    setStockData(result.data.reverse());
  };
  
  useEffect(() => {
    getStockList();
    const stockId = searchParams.get('stockId') || '2330';
    getStockDetail(stockId);
  },[])

  return (
    <>
    <div className="text-[#EEE] h-[calc(100vh-48px)] w-full flex grid-flow-col">
      <div className="w-[46%] mt-2">
        <div className="w-full h-[50%] block overflow-auto border border-[#1D1D1E] rounded-md">
          <table className="w-full mt-2 rounded-md" cellSpacing="0">
            <caption className="caption-top mb-2">
              Update Time : {yesterdayDate.toISOString().split('T')[0]} 23:30
            </caption>
            <thead className="sticky top-0 text-sm text-center font-medium bg-[#1D1D1E]">
              <tr>
                <th scope="col">Stock Id</th>
                <th scope="col">Name</th>
                <th scope="col">Open</th>
                <th scope="col">High</th>
                <th scope="col">Low</th>
                <th scope="col">Close</th>
                <th scope="col">Spread</th>
                <th scope="col">Spread %</th>
                <th scope="col">Volume</th>
              </tr>
            </thead>
            <tbody>
              { stockList.map((stock, i) => (
              <tr key={i}
                className={`${stockId === stock?.stock_id?'bg-[#434344]' :'bg-[#343435]'} cursor-pointer text-sm text-center border-t border-[#434344]`}
                onClick={()=> getStockDetail(stock?.stock_id)}
              >
                <td className={`${stockId === stock?.stock_id && 'text-[#E7893C]'}`} >{stock?.stock_id}</td>
                <td className={`${stockId === stock?.stock_id && 'text-[#E7893C]'}`}>{stock?.name}</td>
                <td className="px-2">{stock?.open}</td>
                <td className="px-2">{stock?.high}</td>
                <td className="px-2">{stock?.low}</td>
                <td className="px-2">{stock?.close}</td>
                <td className={`${stock?.spread < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.spread}</td>
                <td className={`${stock?.spread < 0 ?'text-[#FF5972]':'text-[#30DEAB]'}`}>{stock?.spreadPCT}</td>
                <td >{stock?.trading_volume}</td>
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
