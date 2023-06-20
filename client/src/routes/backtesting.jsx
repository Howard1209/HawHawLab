export default function Backtesting() {
  return (
    <>
      <div id="backtesting-container" className="border border-red-500 min-h-screen grid grid-cols-3" >
        <div className="form border-2 border-red-300 min-h-screen col-span-1">
          <form id="backtesting-form">
            <h1>Test your strategy</h1>
            <input
              id="startDate"
              aria-label="Search contacts"
              placeholder="Stock id"
              type="search"
              name="startDate"
            />
          </form>
        </div>
        <div className="chart border-2 border-blue-500 min-w-full col-span-2">
          <p>chart area</p>
        </div>
      </div>
      
    </>
  );
}