import api from "../utils/api";

// eslint-disable-next-line react/prop-types
export default function PostStrategy({ renderChart }){
  return<>
    <button className="bg-gray-300 mt-4 rounded px-1 py-1 transition-all" onClick={async ()=> {
      const result = await api.postData();
      renderChart(result);
    }}>
      Sent fake data
    </button>
  </>
}

export function OpenCombination(){
  return(
    <>
      <select name="openMethod" className="bg-blue-200 w-20 h-6 text-center mr-1">
        <option value="ma">MA</option>
        <option value="taiex">Taiex</option>
        <option value="kd">KD</option>
        <option value="investmentTrust">投信</option>
        <option value="foreignInvestors">外資</option>
      </select>
      <select name="openSymbol" className="bg-blue-200 w-20 h-6 text-center mr-1">
        <option value="greater">Greater</option>
        <option value="less">less</option>
      </select>
      <input name="openValue" placeholder="number" type="number" className="bg-blue-200 w-20 h-6 text-center"/>
    </>
  )
}

export function CloseCombination(){
  return(
    <>
      <select name="closeMethod" className="bg-red-200 w-20 h-6 text-center mr-1">
        <option value="ma">MA</option>
        <option value="taiex">Taiex</option>
        <option value="kd">KD</option>
        <option value="investmentTrust">投信</option>
        <option value="foreignInvestors">外資</option>
      </select>
      <select name="closeSymbol" className="bg-red-200 w-20 h-6 text-center mr-1">
        <option value="greater">Greater</option>
        <option value="less">less</option>
      </select>
      <input name="closeValue" placeholder="number" type="number" className="bg-red-200 w-20 h-6 text-center"/>

    </>
  )
}
