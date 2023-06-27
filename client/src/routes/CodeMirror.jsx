import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import Split from 'react-split'
import api from "../utils/api";

const explain = `// 請修改以下 variable 的 value
const startDate = '2023-06-01';
const endDate = '2023-06-14';
const stockId = '2330';
const ma = [5, 10, 20]; // it can not be change, i will fix it soon.
const type = 'long'; // long or short

// 請勿修改下方的code
console.log(JSON.stringify({startDate, endDate, stockId, ma, type}));

// The trigger you want to set up, i can be empty;

// You can use Stock, preStock, taiex, preTaiex these object
// Condition area
`;

export default function Script() {
  const [code, setCode] = useState(explain);

  const submitCode = async() => {
    const result = await api.postScript(code);
    console.log(result);
  }

  return (
    <>
    <div className="bg-gray-300 min-h-screen">
      <Split
          sizes={[25, 75]}
          className="split"
          minSize={50}
      >
        
        <CodeMirror
          value={code}
          height="500px"
          theme={vscodeDark}
          extensions={[javascript()]}
          onChange={(value) => setCode(value)}
        />
        <div className="border-2 bg-green-500 w-[500px] text-center" onClick={submitCode}>Start Backtesting</div>

        

      </Split>
        {/* <CodeMirror
          value={code}
          height="500px"
          theme={vscodeDark}
          extensions={[javascript()]}
          onChange={(value) => setCode(value)}
        />
        <div className="border-2 bg-green-500 w-[500px] text-center" onClick={submitCode}>Start Backtesting</div> */}
    </div>
    </>
  );
}
