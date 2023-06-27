import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

HistogramInScript.propTypes = {
  data: PropTypes.shape({
    profitRecordsByDate: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string,
        profit: PropTypes.number,
      })
    ),
  }).isRequired,
};

export default function HistogramInScript({data}) {

  if (!Object.keys(data).length > 0) return;
  const perTrade = data.profitRecordsByDate;

  const cumulativeProfit = perTrade.reduce((acc, item) => {
    const previousSum = acc.length > 0 ? acc[acc.length - 1] : 0;
    const updatedSum = previousSum + item.profit;
    acc.push(updatedSum);
    return acc;
  }, []);

  
  return(
    
    <div id="bar">
      <Chart data= {{
        labels: perTrade?.map((ele) => ele.date),
        datasets: [
          {
            type: 'line',
            label: 'Cumulative profit',
            data: cumulativeProfit,
            borderColor: 'rgb(41, 150, 256)',
            backgroundColor: 'rgba(41, 150, 256, 0.5)',
          },
          {
            type: 'bar',
            label: 'Profit',
            data: perTrade?.map(ele => ele.profit),
            backgroundColor: perTrade?.map(ele => {
              if (ele.profit >= 0) {
                return '#26a69a'
              }
              return 'rgb(255, 99, 132)'
            }),
          },
        ],
        option: {
          layout: {
            autoPadding: true
          }
        }
      }} />
    </div>
  )
}
