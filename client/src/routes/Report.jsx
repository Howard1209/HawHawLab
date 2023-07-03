import PropTypes from 'prop-types';

export default function Report({data}){
  return(
    <>
    <div className="grid grid-cols-3 mb-1 border-b-2 border-[#E7893C] pb-1 h-7">
      <div className="border-r-2 mr-3 pl-2 col-span-2">{Object.keys(data).length > 0 &&'Success rate'}</div>
      <div>{Object.keys(data).length > 0 &&`${data?.successRate}%`}</div>
    </div>
    <div className="grid grid-cols-3 mb-1 border-b-2 border-[#E7893C] pb-1 h-7">
      <div className="border-r-2 mr-3 pl-2 col-span-2">{Object.keys(data).length > 0 && 'Total trade times'}</div>
      <div>{data?.totalTradeTimes}</div>
    </div>
    <div className="grid grid-cols-3 mb-1 border-b-2 border-[#E7893C] pb-1 h-7">
      <div className="border-r-2 mr-3 pl-2 col-span-2">{Object.keys(data).length > 0 &&'Gain times'}</div>
      <div>{data?.numberOfGains}</div>
    </div>
    <div className="grid grid-cols-3 mb-1 border-b-2 border-[#E7893C] pb-1 h-7">
      <div className="border-r-2 mr-3 pl-2 col-span-2">{Object.keys(data).length > 0 &&'Loss times'}</div>
      <div>{data?.numberOfLosses}</div>
    </div>
    <div className="grid grid-cols-3 mb-1 border-b-2 border-[#E7893C] pb-1 h-7">
      <div className="border-r-2 mr-3 pl-2 col-span-2">{Object.keys(data).length > 0 &&'Total profit'}</div>
      <div>{data?.totalProfit}</div>
    </div>
    <div className="grid grid-cols-3 mb-1 border-b-2 border-[#E7893C] h-7">
      <div className="border-r-2 mr-3 pl-2 col-span-2">{Object.keys(data).length > 0 &&'Maximum Profit'}</div>
      <div>{data?.maximumProfit}</div>
    </div>
    <div className="grid grid-cols-3 mb-1 border-b-2 border-[#E7893C] pb-1 h-7">
      <div className="border-r-2 mr-3 pl-2 col-span-2">{Object.keys(data).length > 0 &&'Maximum Loss'}</div>
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
