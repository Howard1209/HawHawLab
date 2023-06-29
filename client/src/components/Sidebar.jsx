import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { VscBeaker, VscVmActive } from "react-icons/vsc";
import { AiOutlineAreaChart } from "react-icons/ai";
import { GoPlusCircle } from "react-icons/go";
import { Link } from "react-router-dom";


const Sidebar = () => {
  const menus =[
    {name:"Home",link:'/',icon: MdOutlineDashboard},
    {name:"My strategy",link:'/',icon: VscBeaker},
    {name:"Create strategy",link:'/codeMirror',icon: GoPlusCircle},
    {name:"Stock info",link:'/',icon: AiOutlineAreaChart},
    {name:"大盤市況",link:'/taiex',icon: VscVmActive},
    {name:"dashboard",link:'/',icon: MdOutlineDashboard}
  ];
  const [open, setOpen] = useState(true);

  return(
    <>
      <div className={`bg-[#1D1D1E] min-h-screen ${open ? 'w-48':'w-16'} duration-500 text-[#BABCBC] px-4 rounded`}>
        <div className='py-3 flex justify-end'>
        
          <HiMenuAlt3 size={26} className='cursor-pointer' onClick={()=>setOpen(!open)}/>
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
        {menus?.map((menu,i) =>(
          <Link
            to={menu?.link}
            key={i}
            className="group flex items-center text-sm gap-3.5 fort-medium p-2 hover:text-[#30DEAB] rounded-md">
            <div>
              {React.createElement(menu?.icon,{size:'20'})}
            </div>
            <h2
            className={`whitespace-pre duration-500 
            ${!open && 'opacity-0 translate-x-28 overflow-hidden'
            }`}
            >
              {menu?.name}
            </h2>
            <h2 className={`${
              open && "hidden"
            } absolute left-36 bg-[#434344] font-semibold whitespace-pre text-[#BABABC]
             rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1
             group-hover:left-12 group-hover:duration-300 group-hover:w-fit `}
            >
              {menu?.name}
            </h2>
          </Link>
          ))
        }
        </div>
      </div>
    </>

  )
}

export default Sidebar