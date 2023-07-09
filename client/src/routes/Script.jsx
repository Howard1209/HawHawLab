import { useEffect, useRef, useState } from "react"
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import Split from 'react-split';
import { toast } from 'react-toastify';
import { DiJavascript1 } from "react-icons/di"
import 'react-toastify/dist/ReactToastify.css';
import ScriptDoc from "../components/ScriptDoc"
import api from "../utils/api";
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { usernameState , loginBtnState} from '../atom/Atom';
import { useSearchParams } from "react-router-dom";

const explain =
`const startDate = '2023-06-01';
const endDate = '2023-07-11';
const stockId = '2330';
const type = 'long'; // long or short

// Do not revise exports
exports = {startDate, endDate, stockId, type};
// The trigger you want to set up, it can be empty;

// Loop area
`;

export default function Script() {
  let [searchParams] = useSearchParams();
  const [code, setCode] = useState('');
  const [data, setJsonData] = useState({});
  const [report, setReport] = useState({});
  const setUsername = useSetRecoilState(usernameState)
  const setIsShowing = useSetRecoilState(loginBtnState);
  const [proportion, setProportion] = useState([40, 60])
  const [tabSelected, setTabSelected] = useState({
    currentTab: 1,
    noTabs: 3,
  })
  const navigate = useNavigate();
  const codeRef = useRef(null);

  function sendCode(value){
    if (codeRef.current) {
      const cmLines = document.getElementsByClassName('cm-line');
      const activeLine = document.querySelector('.cm-activeLine');
      let activeLineIndex = 0;
      for (let i = 0; i < cmLines.length; i++) {
        if (cmLines[i] === activeLine) {
          activeLineIndex = i;
          break;
        }
      }
      const text = code.split('\n');
      text.splice((activeLineIndex + 1), 0, value);
      setCode(text.join('\n'));
    }
  }

  const submitCode = async() => {
    const result = await api.postScript(code);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setProportion([20,80]);
    setTabSelected({ ...tabSelected, currentTab: 1 });
    setJsonData(result.report);
    const {successRate, totalProfit, maximumLoss, maximumProfit} = result.report;
    setReport({
      successRate,
      totalProfit,
      maximumLoss,
      maximumProfit,
    });
  }

  const saveCode = async(code) => {
    const title = document.getElementById('strategyName').value;
    if (title==='') {
      toast.error('Please name your strategy');
      return
    }
    const jwtToken = localStorage.getItem('access_token');
    const {data} = await api.getProfile(jwtToken);
    const strategyId = searchParams.get('id');
    
    if (strategyId === null) {
      const strategyInfo = {
        userId: data.id,
        title,
        code,
        report
      }
      const result = await api.saveStrategy(strategyInfo);
      if (result.error) {
        toast.error(result.error);
        return;
      }  
    } else {
      const updateInfo = {
        id : strategyId,
        code,
        report
      }
      const result = await api.updateStrategy(updateInfo);
      if (result.error) {
        toast.error(result.error);
        return;
      }  
    }
    toast.success('Save strategy success');
  }

  useEffect(()=>{
    const jwtToken = window.localStorage.getItem('access_token');
    if (!jwtToken) {
      setIsShowing(true);
      navigate('/');
      return
    }
    const strategyId = searchParams.get('id');
    if (strategyId === null) {
      setCode(explain);
      return
    }
    api.searchStrategy(strategyId).then(result => {
      const {code, title} = result.strategy;
      setCode(code);
      document.getElementById('strategyName').value = title;
    })

  },[navigate, searchParams, setIsShowing, setUsername])

  return (
    <>
      <div className="mt-2 rounded-md h-[calc(100vh-56px)] ">
        <Split
          sizes={proportion}
          className={`split`}
          minSize={260}
          
          >
          <div id="codeMirror-area" className="h-100%">
            <div id="filename" className="flex mb-2">
              <div>
                <input id="strategyName" type="text" placeholder="Untitled" className="text-center text-[#EEE] w-40 h-fit mr-2 bg-[#505051] rounded-md"/>
              </div>
              <div className="bg-[#343435] rounded-lg">
                <button onClick={()=>saveCode(code)} type="button" className="mx-2 text-[#30DEAB]">Save</button>
              </div>
              <div className="ml-auto mr-1">
                <DiJavascript1 className="text-[#E7893C] text-2xl"/>
              </div>
            </div>
            <div className="border-[#1D1D1E] rounded-lg shadow-[0_2px_10px] text-sm">
              <CodeMirror
                ref={codeRef}
                id="codemirror"
                height="auto"
                maxHeight="588px"
                value={code}
                theme={vscodeDark}
                options={{
                  lineNumbers: true,
                  autofocus: true,
                }}
                extensions={[javascript()]}
                onChange={(value) =>{
                  setCode(value);
                }}
              />
            </div>
            <div className="mt-3 flex">
              <button
                type="button"
                onClick={submitCode}
                className="bg-[#343435] cursor-pointer text-[#E7893C] hover:text-[#30DEAB]
                  px-2 py-1 text-center mx-auto rounded-xl transition-all hover:scale-105">
                  Start Backtesting
              </button>
            </div>
          </div>
          <div id="chart-area" className="min-w-[350px] max-h-full">
            <ScriptDoc data={data} setReport={setReport}
             sendCode={sendCode} setProportion={setProportion} tabSelected={tabSelected} setTabSelected={setTabSelected}/>
          </div>
        </Split>
      </div>
    </>
  );
}
