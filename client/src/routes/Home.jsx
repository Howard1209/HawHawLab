import { MdOutlineNotStarted } from "react-icons/md";
import { HomeChart } from "../components/HomeChart";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Landing = () => {
  const navigate = useNavigate();
  const navigateStrategy = () => {
    const jwtToken = window.localStorage.getItem('access_token');
    if (!jwtToken) {
      toast.error('Please login first');
      return;
    }
    navigate('/codemirror')
  };

  return(
    <>
    <div id='page' className='flex h-[calc(100vh-48px)] p-2 gap-1
    bg-gradient-to-tr	from-[#72313b] via-[#141415] to-[#07503a] rounded-md'>
      <div className=" w-[33%] mt-40 pl-14">
        <div className="mb-5 text-4xl font-bold text-[#EEEEEE] ">Strategy, meet results.</div>
        <p className="text-base font-light text-stone-400 ">
          Strategies that undergo historical simulations can stand the test of time and achieve excess returns!
        </p>
        <div className="text-[#BABCBC] font-semibold flex justify-center items-center border border-[#505051] mt-6 w-fit p-1 rounded-lg transition-all hover:scale-105">
          <div className="relative flex">
            <MdOutlineNotStarted size={24}  className="mx-1 text-[#FF5972] absolute inline-flex animate-ping"/>
            <MdOutlineNotStarted size={24} className="mx-1 text-[#FF5972] relative "/>
          </div>
          <div onClick={navigateStrategy} className="group mr-1 text-[#FFFFFF] cursor-pointer">GET STARTED</div>
        </div>
      </div>
      <div className="w-[67%] text-white px-6 pt-16 h-fit">
        <HomeChart/>
      </div>
    </div>
  </>
  )
}

export default Landing