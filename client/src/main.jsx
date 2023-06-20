import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'
import Backtesting from './routes/backtesting'
import TradingView from './routes/tradingView'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
          <Route path="/" element={ <App /> } />
          <Route path="/backtesting" element={ <Backtesting /> } />
          <Route path="/tradingView" element={ <TradingView />} />
        </Routes>
  </BrowserRouter>
)
