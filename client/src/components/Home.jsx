import { MdOutlineNotStarted } from "react-icons/md";
import { HomeChart } from "./HomeChart";

const Landing = () => {
  return(
    <div id='page' className='flex h-full w-full p-2 gap-1
    bg-gradient-to-tr	from-[#72313b] via-[#141415] to-[#07503a]'>
      <div className=" w-[33%] mt-40 pl-16">
        <div className="mb-5 text-3xl text-[#EEEEEE] ">Science!  Simple!</div>
        <p className="text-base font-light text-stone-400 ">
          Strategies that undergo historical simulations can stand the test of time and achieve excess returns!
        </p>
        <div className="text-[#BABCBC] flex font-light border border-[#505051] mt-6 w-fit p-1 rounded-lg transition-all hover:scale-105">
          <MdOutlineNotStarted className="mt-1 mx-1 justify-center text-[#FF5972]"/>
          <div className="group justify-center mr-1 text-white cursor-pointer">Get Started</div>
        </div>
      </div>
      <div className="w-[67%] text-white px-6 pt-16 h-fit">
        <HomeChart/>
      </div>
    </div>
  )
}

export default Landing