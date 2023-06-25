import { useState } from "react"

export function OpenCombination(){
  const [val, setVal] = useState([]);
  const handleAdd = () => {
    const handelVal = [...val, []];
    setVal(handelVal);
  };
  const handleChange = (onChangeValue, i) => {
    const inputData = [...val];
    inputData[i]= onChangeValue.target.value
    setVal(inputData)
  };
  const handleDelete= (i) => {
    const deleteVal = [...val];
    deleteVal.splice(i,1);
    setVal(deleteVal);
  };

  return(
    <>
    <p className="mt-2 mb-2 h-6">Open combination: 
      <button onClick={() => handleAdd()} type="button" className=" ml-2  w-6 h-6 text-center rounded-lg bg-emerald-500">+</button>
    </p>
    {val.map((data, i) => {
      return(
        <>
        <div key={i} className="mb-1">
          <select name="openMethod" className="bg-blue-200 w-20 h-6 text-center mr-1">
            <option value="close">Close</option>
            <option value="ma">MA</option>
            <option value="taiex">Taiex</option>
            <option value="kd">KD</option>
            <option value="investmentTrust">投信</option>
            <option value="foreignInvestors">外資</option>
            <option value="spreadPCT">漲跌幅</option>
          </select>
          <select name="openSymbol" className="bg-blue-200 w-28 h-6 text-center mr-1">
            <option value="greater">Greater than</option>
            <option value="less">Less than</option>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
          <input name="openValue" value={data} onChange={e=>handleChange(e,i)} placeholder="pending" className="bg-blue-200 w-20 h-6 text-center"/>
          <button type="button" onClick={() => handleDelete(i)} className=" text-center ml-2  w-6 h-6 rounded-lg bg-rose-500">x</button>
        </div> 
        </> 
      )
    })}
    </>
  );
}

export function CloseCombination(){
  const [val, setVal] = useState([]);
  const handleAdd = () => {
    const handelVal = [...val, []];
    setVal(handelVal);
  };
  const handleChange = (onChangeValue, i) => {
    const inputData = [...val];
    inputData[i]= onChangeValue.target.value
    setVal(inputData)
  };
  const handleDelete= (i) => {
    const deleteVal = [...val];
    deleteVal.splice(i,1);
    setVal(deleteVal);
  };
  return(
    <>
    <p className="mt-2 mb-2 h-6">Close combination: 
      <button onClick={() => handleAdd()} type="button" className=" ml-2  w-6 h-6 text-center rounded-lg bg-emerald-500">+</button>
    </p>
    {val.map((data, i) => {
      return(
        <>
        <div key={i} className="mb-1">
          <select name="closeMethod" className="bg-red-200 w-20 h-6 text-center mr-1">
          <option value="close">Close</option>
          <option value="ma">MA</option>
          <option value="taiex">Taiex</option>
          <option value="kd">KD</option>
          <option value="investmentTrust">投信</option>
          <option value="foreignInvestors">外資</option>
          <option value="spreadPCT">漲跌幅</option>
          </select>
          <select name="closeSymbol" className="bg-red-200 w-28 h-6 text-center mr-1">
            <option value="less">Less than</option>
            <option value="greater">Greater than</option>
          </select>
          <input name="closeValue" value={data} onChange={e=>handleChange(e,i)} placeholder="pending" className="bg-red-200 w-20 h-6 text-center"/>
          <button type="button" onClick={() => handleDelete(i)} className=" text-center ml-2  w-6 h-6 rounded-lg bg-rose-500">x</button>
        </div>
        </>
      )
    })}
    </>
  )
}
