import { useState } from "react";
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useLocation } from "react-router-dom";


function App() {
  const [open, setOpen] = useState(true);
  let location = useLocation();

  return (
    <section className='flex gap-1'>
      <Sidebar open={open} setOpen={setOpen} location={location} />
      <div className='w-full'>
        <Header/>
        <Outlet context={[open]}/>
      </div>
    </section>
  )
}

export default App
