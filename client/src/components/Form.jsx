import { OpenCombination, CloseCombination } from "./components";
import { toast } from 'react-toastify';
import api from "../utils/api";

// eslint-disable-next-line react/prop-types
function StrategyFrom({renderChart}) {
  const submitForm = async (e) => {
    e.preventDefault();
    const data = e.target;
    if (data.startDate.value > data.endDate.value) {
      toast.error("Start date can't not greater than end date");
      return;
    }
    if (!data.openMethod || ! data.closeMethod) {
      toast.error('Please complete the combination!');
      return;
    }
    const result = await api.postData(e.target);
    if (result.error) {
      toast.error(result.error.toString());
      return;
    }
    renderChart(result.backtestingReport);
  };
  
  return (
    <>
      <div className="text-xl text-center my-2">Strategy Form</div>
      <div className="input pl-2 pr-4">
        <form onSubmit={submitForm}>
          <div className="mb-2 bg-[#343435] rounded-lg h-fit w-fit p-1 py-auto">
            <label >Start date: </label>
            <input name="startDate" type="date" min={"2022-01-01"} required className="bg-[#343435]"/>
          </div>
          <div className="mb-2 bg-[#343435] rounded-lg h-fit w-fit p-1 py-auto">
            <label >End date: </label>
            <input name="endDate" type="date" required className="bg-[#343435]"/>
          </div>
          <div className="mb-2 bg-[#1D1D1E] border border-[#BABCBC] rounded-lg h-fit w-fit p-1 py-auto">
            <label >Stock ID: </label>
            <input className="text-center w-20 bg-[#1D1D1E]" name="stockId" type="text" required />
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="text-center rounded-lg bg-[#343435] text-[#30DEAB]">
              <input type="radio" id="long" name="type" value={'long'} required/>
              <label id="long"> Long</label>
            </div>
            <div className="text-center rounded-lg bg-[#343435] text-[#FF5972]">
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
          <div className=" text-center text-[#E7893C] mt-5">
            <button type="submit" className=" bg-[#343435] cursor-pointer text-[#E7893C] hover:text-[#30DEAB]
              px-2 py-1 text-center mx-auto rounded-xl transition-all hover:scale-105">
              Start Backtesting
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default StrategyFrom;