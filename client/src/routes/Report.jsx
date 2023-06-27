import PropTypes from 'prop-types';

export default function Report({data}){
  return(
    <>
    <div className="grid grid-cols-2 mt-2 mb-1 border-b-2 border-red-300 pb-1">
      <div className="border-r-4 mr-3 pl-2">Success rate</div>
      <div>{data?.successRate}%</div>
    </div>
    <div className="grid grid-cols-2 mb-1 border-b-2 border-red-300 pb-1">
      <div className="border-r-4 mr-3 pl-2">Total trade times</div>
      <div>{data?.totalTradeTimes}</div>
    </div>
    <div className="grid grid-cols-2 mb-1 border-b-2 border-red-300 pb-1">
      <div className="border-r-4 mr-3 pl-2 ">Gain times</div>
      <div>{data?.numberOfGains}</div>
    </div>
    <div className="grid grid-cols-2 mb-1 border-b-2 border-red-300 pb-1">
      <div className="border-r-4 mr-3 pl-2">Loss times</div>
      <div>{data?.numberOfLosses}</div>
    </div>
    <div className="grid grid-cols-2 mb-1 border-b-2 border-red-300 pb-1">
      <div className="border-r-4 mr-3 pl-2">Total profit</div>
      <div>{data?.totalProfit}</div>
    </div>
    <div className="grid grid-cols-2 mb-1 border-b-2 border-red-300">
      <div className="border-r-4 mr-3 pl-2">Maximum Profit</div>
      <div>{data?.maximumProfit}</div>
    </div>
    <div className="grid grid-cols-2 mb-1 border-b-2 border-red-300 pb-1">
      <div className="border-r-4 mr-3 pl-2">Maximum Loss</div>
      <div>{data?.maximumLoss}</div>
    </div>
    </>

  )
}

Report.propTypes = {
  data: PropTypes.shape({
    successRate: PropTypes.number,
    totalTradeTimes: PropTypes.number,
    numberOfGains: PropTypes.number,
    numberOfLosses: PropTypes.number,
    totalProfit: PropTypes.number,
    maximumProfit: PropTypes.number,
    maximumLoss: PropTypes.number,
  }).isRequired,
};
