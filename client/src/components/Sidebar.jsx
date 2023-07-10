import React, { useEffect } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { VscBeaker, VscVmActive } from "react-icons/vsc";
import { AiOutlineAreaChart } from "react-icons/ai";
import { TbLogout } from "react-icons/tb"
import { FaCodepen, FaWpforms } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loginState, usernameState} from '../atom/Atom';


const Sidebar = ({ open, setOpen, location }) => {
  const menus =[
    {name:"Home",link:'/',icon: MdOutlineDashboard},
    {name:"My Strategy",link:'/myStrategy',icon: VscBeaker},
    {name:"Script Strategy",link:'/script',icon: FaCodepen},
    {name:"Form Strategy",link:'/form',icon: FaWpforms},
    {name:"Stock Info",link:'/stock',icon: AiOutlineAreaChart},
    {name:"Market Info",link:'/taiex',icon: VscVmActive},
  ];
  const [isLogin , setIsLogin] = useRecoilState(loginState);
  const setUsername = useSetRecoilState(usernameState);

  const navigate = useNavigate();
  const sentLogout = () => {
    localStorage.removeItem('access_token');
    setUsername('Sign In');
    setIsLogin(false);
    navigate('/');
  };

  if (location.pathname === '/form' || location.pathname === '/script' || location.pathname === '/stock') {
    if (open) {
      setOpen(!open)
    }
  }

  useEffect(()=>{
    const jwt = window.localStorage.getItem('access_token');
    if (jwt === null) {
      setIsLogin(false)
      return
    }
    setIsLogin(true)
  },[setIsLogin])

  return(
    <>
      <div className={`bg-[#1D1D1E] min-h-screen ${open ? 'w-48':'w-16'} duration-500 px-4 rounded z-50`}>
        <div className='py-3 flex justify-end'>
          <HiMenuAlt3 size={26} id="sidebarButton" className='cursor-pointer text-[#BABCBC]' onClick={()=>setOpen(!open)}/>
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
        {menus?.map((menu,i) =>(
          <Link
            to={menu?.link}
            key={i}
            className={`group flex items-center text-sm gap-3.5 fort-medium p-2 ${(location.pathname === menu.link)?'text-[#30DEAB]':'text-[#BABCBC]'}
            hover:text-[#30DEAB] transition-all hover:scale-105 rounded-md`}>
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
        {isLogin &&
          <div className="group text-[#BABCBC] flex items-center text-sm gap-3.5 fort-medium p-2 cursor-pointer
          hover:text-[#bb3f52] transition-all hover:scale-105 rounded-md"
          onClick={sentLogout}
          >
            <div>
              <TbLogout size={20}/>
            </div>
            <h2 className={`whitespace-pre duration-500 
              ${!open && 'opacity-0 translate-x-28 overflow-hidden'
              }`}>Log out
            </h2>
            <h2 className={`${
              open && "hidden"
            } absolute left-36 bg-[#434344] font-semibold whitespace-pre text-[#BABABC]
             rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1
             group-hover:left-12 group-hover:duration-300 group-hover:w-fit `}
            >
              Log out
            </h2>
          </div>         
        }
        </div>        
      </div>
    </>

  )
}

Sidebar.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  location: PropTypes.object
};  

export default Sidebar