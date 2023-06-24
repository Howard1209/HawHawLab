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

// eslint-disable-next-line react/prop-types
export default function Histogram({data}) {

  if (!Object.keys(data).length > 0) return;
  // eslint-disable-next-line react/prop-types
  const perTrade= data.perTrade;

  const cumulativeProfit = perTrade.reduce((acc, item) => {
    const previousSum = acc.length > 0 ? acc[acc.length - 1] : 0;
    const updatedSum = previousSum + item.profit;
    acc.push(updatedSum);
    return acc;
  }, []);
  
  console.log(cumulativeProfit);
  return(
    
    <div id="bar">
      <Chart data= {{
        // eslint-disable-next-line react/prop-types
        labels: perTrade?.map((ele) => ele.closeDay),
        datasets: [
          {
            type: 'line',
            label: 'Cumulative profit',
            // eslint-disable-next-line react/prop-types
            data: cumulativeProfit,
            borderColor: 'rgb(41, 150, 256)',
            backgroundColor: 'rgba(41, 150, 256, 0.5)',
          },
          {
            type: 'bar',
            label: 'Profit',
            // eslint-disable-next-line react/prop-types
            data: perTrade?.map(ele => ele.profit),
            // eslint-disable-next-line react/prop-types
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