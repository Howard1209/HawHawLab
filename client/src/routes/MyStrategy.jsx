import { useEffect, useState } from "react";
import { useRecoilValue } from 'recoil';
import { userIdState} from '../atom/Atom';
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCodepen } from "react-icons/fa";
import { HiOutlineScale } from "react-icons/hi";
import { toast } from 'react-toastify';
import api from "../utils/api";


const MyStrategy = () => {
  const userId = useRecoilValue(userIdState);
  const [strategy, setStrategy] = useState([]);
  const getStrategy = async(userId) => {
    const result = await api.getStrategy(userId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    const formattedStrategy = result.strategy.map(item => {
      const formattedTime = new Date(item.update_time).toISOString().slice(0, 19).replace('T', ' ');
      return {
        ...item,
        update_time: formattedTime
      };
    });
    setStrategy(formattedStrategy);
  }
  useEffect(()=>{
    getStrategy(userId)
  },[userId])

  return(
    <>
    <div id="strategyContainer"
      className="text-[#EEE] h-[calc(100vh-48px)] p-2"
    >
      <div className="text-3xl">My Strategy</div>
      {strategy.length > 0 && strategy?.map((ele,i) => (
         <div key={i} className="flex items-center mt-8 bg-[#1D1D1E] rounded-xl px-5 py-2">
          <HiOutlineScale className="mr-5 text-2xl text-[#E7893C]"/>
          <div>
            <span className="text-xl">{ele.title} </span>
            <div className="flex items-center mt-3 mb-1">
              <button type="button" className="bg-[#434344] flex items-center rounded-lg px-2 mr-2 hover:text-[#E7893C]">
                <FaCodepen/>
                <span className="ml-1">Edit</span>
              </button>
              <RiDeleteBin5Line className="text-xl cursor-pointer hover:text-red-600"/>
            </div>
          </div>
          <div className="ml-20 flex text-center">
            <div className=" text-sm border-r-2 pr-3 border-[#505051]">
              <div>SUCCESS RATE</div>
              <div className="pt-2 text-blue-500">{ele.success_rate}%</div>
            </div>
            <div className=" text-sm border-r-2 px-3 border-[#505051]">
              <div> TOTAL PROFIT</div>
              <div className="pt-2">{ele.total_profit}</div>
            </div>
            <div className=" text-sm border-r-2 px-3 border-[#505051]">
              <div>MAXIMUM LOSS</div>
              <div className="pt-2 text-[#FF5972]">{ele.maximum_loss}</div>
            </div>
            <div className=" text-sm border-r-2 px-3 border-[#505051]">
              <div> MAXIMUM PROFIT</div>
              <div className="pt-2 text-[#30DEAB]">{ele.maximum_profit}</div>
            </div>
            <div className=" text-sm pl-4 border-[#505051]">
              <div> UPDATE TIME</div>
              <div className="pt-2 text-[#BABCBC] text-start">{ele.update_time}</div>
            </div>
          </div>
        </div> 
      ))}
    </div>
    </>
  )
}

export default MyStrategy;