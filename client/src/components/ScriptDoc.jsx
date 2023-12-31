import { useRef, useEffect } from "react";
import ScriptChart from "../components/ScriptChart"
import NestedList from './NestedList';
import PropTypes from 'prop-types';

export default function ScriptDoc({data, setReport, sendCode, setProportion, tabSelected, setTabSelected}) {
  const wrapperRef = useRef(null)

  const handleKeyDown = e => {
    if (e.keyCode === 39) {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        if (
          tabSelected.currentTab >= 1 &&
          tabSelected.currentTab < tabSelected.noTabs
        ) {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.currentTab + 1,
          })
        } else {
          setTabSelected({
            ...tabSelected,
            currentTab: 1,
          })
        }
      }
    }

    if (e.keyCode === 37) {
      if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        if (
          tabSelected.currentTab > 1 &&
          tabSelected.currentTab <= tabSelected.noTabs
        ) {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.currentTab - 1,
          })
        } else {
          setTabSelected({
            ...tabSelected,
            currentTab: tabSelected.noTabs,
          })
        }
      }
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  })

  return (
    <>
      <section className="max-w-full" aria-multiselectable="false">
        <ul
          className="flex items-center border-b border-[#505051] h-7 mr-2 bg-[#1D1D1E] rounded-t-lg"
          role="tablist"
          ref={wrapperRef}
        >
          <li className="flex-1" role="presentation ">
            <button
              className={`-mb-px inline-flex h-7 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-6 text-sm font-medium tracking-wide transition duration-300 hover:bg-[#434344] hover:stroke-zinc-600 focus-visible:outline-none disabled:cursor-not-allowed ${
                tabSelected.currentTab === 1
                  ? "border-[#30DEAB] stroke-zinc-500 text-[#30DEAB] hover:border-zinc-600  hover:text-zinc-600 focus:border-[#30DEAB] focus:stroke-zinc-700 focus:text-[#30DEAB] disabled:border-slate-500"
                  : "justify-self-center border-transparent stroke-[#505051] text-[#505051] hover:border-[#30DEAB] hover:text-[#30DEAB] focus:border-zinc-600 focus:stroke-zinc-600 focus:text-zinc-600 disabled:text-slate-500"
              }`}
              id="tab-label-1a"
              role="tab"
              aria-setsize="3"
              aria-posinset="1"
              tabIndex={`${tabSelected.currentTab === 1 ? "0" : "-1"}`}
              aria-controls="tab-panel-1a"
              aria-selected={`${
                tabSelected.currentTab === 1 ? "true" : "false"
              }`}
              onClick={() => {
                setTabSelected({ ...tabSelected, currentTab: 1 });
                setProportion([24,76])
              }}
            >
              <span>Report</span>
            </button>
          </li>
          <li className="flex-1" role="presentation ">
            <button
              className={`-mb-px inline-flex h-7 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-6 text-sm font-medium tracking-wide transition duration-300 hover:bg-[#434344] hover:stroke-zinc-600 focus-visible:outline-none disabled:cursor-not-allowed ${
                tabSelected.currentTab === 2
                  ? "border-[#30DEAB] stroke-zinc-500 text-[#30DEAB] hover:border-zinc-600  hover:text-zinc-600 focus:border-[#30DEAB] focus:stroke-zinc-700 focus:text-[#30DEAB] disabled:border-slate-500"
                  : "justify-self-center border-transparent stroke-[#505051] text-[#505051] hover:border-[#30DEAB] hover:text-[#30DEAB] focus:border-zinc-600 focus:stroke-zinc-600 focus:text-zinc-600 disabled:text-slate-500"
              }`}
              id="tab-label-2a"
              role="tab"
              aria-setsize="3"
              aria-posinset="2"
              tabIndex={`${tabSelected.currentTab === 2 ? "0" : "-1"}`}
              aria-controls="tab-panel-2a"
              aria-selected={`${
                tabSelected.currentTab === 2 ? "true" : "false"
              }`}
              onClick={() => {
                setTabSelected({ ...tabSelected, currentTab: 2 });
                setProportion([70,30]);
              }}
            >
              <span>Grammar</span>
            </button>
          </li>
          <li className="flex-1" role="presentation ">
            <button
              className={`-mb-px inline-flex h-7 w-full items-center justify-center gap-2 whitespace-nowrap rounded-t border-b-2 px-6 text-sm font-medium tracking-wide transition duration-300 hover:bg-[#434344] hover:stroke-zinc-600 focus-visible:outline-none disabled:cursor-not-allowed ${
                tabSelected.currentTab === 3
                  ? "border-[#30DEAB] stroke-zinc-500 text-[#30DEAB] hover:border-zinc-600  hover:text-zinc-600 focus:border-[#30DEAB] focus:stroke-zinc-700 focus:text-[#30DEAB] disabled:border-slate-500"
                  : "justify-self-center border-transparent stroke-[#505051] text-[#505051] hover:border-[#30DEAB] hover:text-[#30DEAB] focus:border-zinc-600 focus:stroke-zinc-600 focus:text-zinc-600 disabled:text-slate-500"
              }`}
              id="tab-label-3a"
              role="tab"
              aria-setsize="3"
              aria-posinset="3"
              tabIndex={`${tabSelected.currentTab === 3 ? "0" : "-1"}`}
              aria-controls="tab-panel-3a"
              aria-selected={`${
                tabSelected.currentTab === 3 ? "true" : "false"
              }`}
              onClick={() => {
                setTabSelected({ ...tabSelected, currentTab: 3 });
                setProportion([70,30]);
              }}
            >
              <span>Doc</span>
            </button>
          </li>
        </ul>
        <div className="">
          <div
            className={`mt-2 mr-2 text-sm ${
              tabSelected.currentTab === 1 ? "" : "hidden"
            }`}
            id="tab-panel-1c"
            aria-hidden={`${tabSelected.currentTab === 1 ? "true" : "false"}`}
            role="tabpanel"
            aria-labelledby="tab-label-1c"
            tabIndex="-1"
          >
            <ScriptChart data={data} setReport={setReport}/>
          </div>
          <div
            className={`p-4 text-sm ${
              tabSelected.currentTab === 2 ? "" : "hidden"
            }`}
            id="tab-panel-2c"
            aria-hidden={`${tabSelected.currentTab === 2 ? "true" : "false"}`}
            role="tabpanel"
            aria-labelledby="tab-label-2c"
            tabIndex="-1"
          >
            <NestedList sendCode={sendCode}/>
          </div>
          <div
            className={`p-4 text-[#EEE] text-sm overflow-x-auto ${
              tabSelected.currentTab === 3 ? "" : "hidden"
            }`}
            id="tab-panel-3c"
            aria-hidden={`${tabSelected.currentTab === 3 ? "true" : "false"}`}
            role="tabpanel"
            aria-labelledby="tab-label-3c"
            tabIndex="-1"
          >
            <p> Basic ma5 strategy !</p>
            <p> Buy condition : Close price {">"} ma5 </p> 
            <p> Sell condition : Close price {"<"} ma5 </p><br/>                 
            <pre>
              <code>
              {'//'} Loop area<br/>
              const close = stock.close;<br/>
              const preClose = preStock.close<br/>
              const open = stock.open;<br/>
              const preMa5 = preStock.ma5;<br/>
              const ma5 = stock.ma5;<br/><br/>
              const buyCondition = preClose {">"} preMa5;<br/>
              const sellCondition = close {"<"} ma5;<br/><br/>
              </code>
            </pre>
            <pre>
              <code>
                {'/**'}<br/>
                * fill in your condition in if ( )<br/>
                * chang the stock priceType as you already declare<br/>
                * param &#123;number&#123; qty. In sell condition it shares(all stocks).<br/>
                */<br/>
                if (buyCondition) &#123;<br/>
                  action[&quot;buy&quot;](open,1);<br/>
                &#125;<br/><br/>
                if (sellCondition) &#123;<br/>
                  action[&quot;sell&quot;](close, shares);<br/>
                &#125;
              </code>
            </pre>
          </div>
        </div>
      </section>
    </>
  )
}

ScriptDoc.propTypes = {
  data: PropTypes.shape({
    successRate: PropTypes.number,
    totalTradeTimes: PropTypes.number,
    numberOfGains: PropTypes.number,
    numberOfLosses: PropTypes.number,
    totalProfit: PropTypes.number,
    maximumProfit: PropTypes.number,
    maximumLoss: PropTypes.number,
    candleData: PropTypes.array,
    perTrade: PropTypes.array,
  }).isRequired,
  setReport: PropTypes.func,
  sendCode: PropTypes.func,
  setProportion: PropTypes.func,
  tabSelected: PropTypes.shape({
    currentTab: PropTypes.number,
    noTabs: PropTypes.number,
  }).isRequired,
  setTabSelected: PropTypes.func
}
