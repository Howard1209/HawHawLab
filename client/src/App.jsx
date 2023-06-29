import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <section className='flex gap-1'>
      <Sidebar/>
      <div className=' w-full text-xl text-gray-900 font-semibold'>
        <Header/>
        <Outlet/>
      </div>
    </section>
  )
}

export default App
