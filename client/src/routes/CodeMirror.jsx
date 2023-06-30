import { useState } from "react"
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import Split from 'react-split';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScriptChart from "../components/ScriptChart"
import api from "../utils/api";

const explain = `// 請修改以下 variable 的 value
const startDate = '2023-06-01';
const endDate = '2023-06-14';
const stockId = '2330';
const ma = [5, 10, 20];
const kd = true; // setting period = 9;
const type = 'long'; // long or short

// Do not revise module.exports
module.exports = {startDate, endDate, stockId, ma, type, kd};

// The trigger you want to set up, it can be empty;

// You can use Stock, preStock, taiex, preTaiex these object
// Condition area
`;

export default function Script() {
  const [code, setCode] = useState(explain);
  const [data, setJsonData] = useState({});

  const submitCode = async() => {
    const result = await api.postScript(code);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setJsonData(result.report);
  }

  return (
    <>
      <div className="mt-2 border border-[#1D1D1E] rounded-md">
        <Split
            sizes={[23, 77]}
            className="split h-[calc(100vh-56px)]"
            minSize={50}
        >
          <div id="codeMirror-area">
            <div className="h-[calc(85%s)]">
              <CodeMirror
                value={code}
                theme={vscodeDark}
                height="580px"
                extensions={[javascript()]}
                onChange={(value) => setCode(value)}
                className="text-sm"
              />
            </div>
            <div className="mt-5 flex">
              <button
                type="button"
                onClick={submitCode}
                className="bg-[#343435] cursor-pointer text-[#E7893C] hover:text-[#30DEAB]
                  px-2 py-1 text-center mx-auto rounded-xl transition-all hover:scale-105">
                  Start Backtesting
              </button>
            </div>
          </div>
          <div id="chart-area" className="border border-red-300 text-[#EEE]">
            <ScriptChart data = {data}/>
          </div>
        </Split>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
