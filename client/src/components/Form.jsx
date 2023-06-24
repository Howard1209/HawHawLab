import { OpenCombination, CloseCombination } from "./components";
import api from "../utils/api";

// eslint-disable-next-line react/prop-types
function StrategyFrom({renderChart}) {
  const submitForm = async (e) => {
    e.preventDefault(); 
    const result = await api.postData(e.target);
    renderChart(result);
  };
  
  return (
    <>
      <div className="text-xl">Strategy From</div>
      <div className="input">
        <form onSubmit={submitForm}>
          <div>
            <label >Start date: </label>
            <input name="startDate" type="date" placeholder="YYYY-MM-DD" min={"2022-01-01"} max={"2023-06-14"} required/>
          </div>
          <div>
            <label >End date: </label>
            <input name="endDate" type="date" placeholder="YYYY-MM-DD" max={"2023-06-14"} required/>
          </div>
          <div>
            <label >Stock ID: </label>
            <input name="stockId" type="text" placeholder="Stock id" required/>
          </div>
          <div>
            <label >做多做空: </label>
            <select name="type">
              <option value="long">long</option>
              <option value="short">short</option>
            </select>
          </div>
          <div>
            <p>Open combination: </p>
            <OpenCombination />
          </div>
          <div>
            <p>Close combination: </p>
            <CloseCombination />
          </div>
          <input type="submit" />
        </form>
      </div>
    </>
  )
}

export default StrategyFrom;