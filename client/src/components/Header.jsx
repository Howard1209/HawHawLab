import { GoPerson } from "react-icons/go";
import { MdAttachMoney } from "react-icons/md";


const Header = () => {
  return(
    <header className="App-header p-2 flex items-center bg-[#1D1D1E] rounded ">
      <p className="text-[#BABCBC]">HawHaw</p>
      <MdAttachMoney className="text-[#E7893C] text-3xl"/>
      <p className="text-[#BABCBC]">Lab</p>

      <div className="flex rounded-3xl w-32 mr-1 ml-auto h-8 items-center
      bg-[#343435] text-[#BABCBC] cursor-pointer hover:text-[#30DEAB]">
        <GoPerson className=" mx-3" size={23}/>
        <div className="text-base">Sign in</div>
      </div>
    </header>
  )
}

export default Header