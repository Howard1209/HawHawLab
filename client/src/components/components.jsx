import { useState } from "react"
import { RxPlusCircled, RxMinusCircled } from "react-icons/rx";

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
    <div className="flex items-center">
      <div className="mt-2 mb-2 h-6">Open combination: </div>
      <RxPlusCircled onClick={() => handleAdd()} className="cursor-pointer text-xl text-[#30DEAB] text-center ml-2 transition-all hover:scale-110"/>
    </div>
    {val.map((data, i) => {
      return(
        <>
        <div key={i} className="mb-1 flex items-center">
          <select name="openMethod" className="bg-[#343435] w-20 h-6 text-center mr-1">
            <option value="close">Close</option>
            <option value="ma">MA</option>
            <option value="taiex">Taiex</option>
            <option value="kd">KD</option>
            <option value="investmentTrust">投信</option>
            <option value="foreignInvestors">外資</option>
            <option value="spreadPCT">漲跌幅</option>
          </select>
          <select name="openSymbol" className="bg-[#343435] w-28 h-6 text-center mr-1">
            <option value="greater">Greater than</option>
            <option value="less">Less than</option>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
          <input name="openValue" value={data} onChange={e=>handleChange(e,i)} placeholder="type" className="bg-[#343435] w-20 h-6 text-center"/>
          <RxMinusCircled onClick={() => handleDelete(i)} className=" cursor-pointer text-xl mt-1 ml-2 text-[#FF5972] transition-all hover:scale-110"/>
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
    <div className="flex items-center">
      <div className="mt-2 mb-2 h-6">Close combination: </div>
      <RxPlusCircled onClick={() => handleAdd()} className="cursor-pointer text-xl text-[#30DEAB] text-center ml-2 transition-all hover:scale-110"/>
    </div>
    {val.map((data, i) => {
      return(
        <>
        <div key={i} className="mb-1 flex items-center">
          <select name="closeMethod" className="bg-[#343435] w-20 h-6 text-center mr-1">
          <option value="close">Close</option>
          <option value="ma">MA</option>
          <option value="taiex">Taiex</option>
          <option value="kd">KD</option>
          <option value="investmentTrust">投信</option>
          <option value="foreignInvestors">外資</option>
          <option value="spreadPCT">漲跌幅</option>
          </select>
          <select name="closeSymbol" className="bg-[#343435] w-28 h-6 text-center mr-1">
            <option value="less">Less than</option>
            <option value="greater">Greater than</option>
          </select>
          <input name="closeValue" value={data} onChange={e=>handleChange(e,i)} placeholder="pending" className="bg-[#343435] w-20 h-6 text-center"/>
          <RxMinusCircled type="button" onClick={() => handleDelete(i)} className=" cursor-pointer text-xl mt-1 ml-2 text-[#FF5972] transition-all hover:scale-110"/>
        </div>
        </>
      )
    })}
    </>
  )
}
