import { OpenCombination, CloseCombination } from "./components";
import api from "../utils/api";

// eslint-disable-next-line react/prop-types
function StrategyFrom({renderChart}) {
  const submitForm = async (e) => {
    e.preventDefault();
    const result = await api.postData( e.target);
    renderChart(result);
  };
  
  return (
    <>
      <div className="text-xl text-center mb-2">Strategy From</div>
      <div className="input pl-2 pr-4">
        <form onSubmit={submitForm}>
          <div className="mb-2">
            <label >Start date: </label>
            <input name="startDate" type="date" min={"2022-01-01"} max={"2023-06-14"} required/>
          </div>
          <div className="mb-2">
            <label >End date: </label>
            <input name="endDate" type="date"  max={"2023-06-14"} required/>
          </div>
          <div className="mb-2">
            <label >Stock ID: </label>
            <input className="text-center w-20" name="stockId" type="text" placeholder="Stock id" required/>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="border-2 text-center rounded-lg bg-emerald-400 text-emerald-900">
              <input type="radio" id="long" name="type" value={'long'} required/>
              <label id="long"> Long</label>
            </div>
            <div className="border-2 text-center rounded-lg bg-rose-300 text-rose-900">
              <input type="radio" id="long" name="type" value={'short'}  className="ml-5" required/>
              <label id="long"> Short</label>
            </div>
          </div>
          <div>
            <OpenCombination />
          </div>
          <div>
            <CloseCombination />
          </div >
          <div className=" bg-black border-2 border-gray-400 text-center mt-3">
            <button type="submit" className="text-white w-full ">Start Backtesting</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default StrategyFrom;