import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userIdState, loginBtnState } from '../atom/Atom';
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCodepen } from "react-icons/fa";
import { HiOutlineScale } from "react-icons/hi";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from "../utils/api";

const MyStrategy = () => {
  const navigate = useNavigate();
  const userId = useRecoilValue(userIdState);
  const setIsShowing = useSetRecoilState(loginBtnState);
  const [strategy, setStrategy] = useState([]);

  const editStrategy = (id) => {
    navigate(`/script?id=${id}`)
  }

  const deleteStrategy = async(id) => {
    const result = await api.deleteStrategy(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Delete success');
    getStrategyAll(userId)
  }

  const getStrategyAll = async(userId) => {
    const result = await api.getStrategyAll(userId);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    const formattedStrategy = result.strategy.map(item => {
      const update_time = new Date(item.update_time);
      update_time.setHours(update_time.getHours() + 8);
      const formattedTime = new Date(update_time).toISOString().slice(0, 19).replace('T', ' ');
      return {
        ...item,
        update_time: formattedTime
      };
    });
    setStrategy(formattedStrategy);
  }
  useEffect(()=>{
    const jwtToken = window.localStorage.getItem('access_token');
    if (!jwtToken) {
      setIsShowing(true);
      navigate('/');
      return
    }
    getStrategyAll(userId)
  },[navigate, setIsShowing, userId])

  return(
    <>
    <div id="strategyContainer"
      className="text-[#EEE] h-[calc(100vh-48px)] p-2"
    >
      <div className="text-3xl text-[#E7893C] text-center py-2">My Strategy</div>
      <div className=" max-h-[calc(100vh-97px)] overflow-y-auto">
      {strategy.length > 0 && strategy?.map((ele,i) => (
         <div key={i} className="flex items-center mt-6 bg-[#343435] rounded-xl px-5 py-2 w-fit mx-auto">
          <HiOutlineScale className="mr-5 text-2xl text-[#E7893C]"/>
          <div className="w-32 ">
            <p className="text-2xl truncate">{ele.title} </p>
            <div className="flex items-center mt-3 mb-1">
              <button type="button"
                onClick={()=>editStrategy(ele.id)}
                className="bg-[#434344] text-[#BABCBC] flex items-center rounded-lg px-2 mr-2 hover:scale-110 hover:text-[#30DEAB]">
                <FaCodepen/>
                <span className="ml-1">Edit</span>
              </button>
              <RiDeleteBin5Line
              onClick={()=>deleteStrategy(ele.id)}
              className="text-xl cursor-pointer hover:text-red-600"/>
            </div>
          </div>
          <div className="ml-16 flex text-center">
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
    </div>
    </>
  )
}

export default MyStrategy;