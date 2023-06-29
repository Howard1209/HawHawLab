import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import TaiexChart from './routes/Taiex';
import Backtesting from './routes/backtesting';
import Script from "./routes/CodeMirror";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={ <App /> } />
      <Route path="/taiex" element= { <TaiexChart />} />
      <Route path="/strategy" element={ <Backtesting /> } />
      <Route path="/codeMirror" element={ <Script /> } />
    </Routes>
  </BrowserRouter>
)
