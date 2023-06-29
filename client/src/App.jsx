import React, { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Body from './components/Body';

function App() {
  
  return (
    <section className='flex gap-6'>
      <Sidebar/>
      <div className='m-3 text-xl text-gray-900 font-semibold'>
        Landing Page
      </div>
    </section>
  )
}

export default App
