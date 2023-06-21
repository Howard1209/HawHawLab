import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from 'react-dom/client'

import App from './App'
import './index.css'
import Backtesting from './routes/backtesting'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
          <Route path="/" element={ <App /> } />
          <Route path="/strategy" element={ <Backtesting /> } />
        </Routes>
  </BrowserRouter>
)
