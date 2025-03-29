import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getRandomColor } from '../utils/getRandomColor';
import '../styles/newsAnalytics.css';

ChartJS.register(ArcElement, Tooltip, Legend);
export function PieChart({ pieChartData }) {
  const keyArr = Object.keys(pieChartData);
  const data = {
    labels: keyArr,
    datasets: [
      {
        label: '# of Votes',
        data: keyArr.map((ele) => pieChartData[ele]),
        backgroundColor: Array(keyArr.length)
          .fill()
          .map(() => getRandomColor()), // Random background colors
        borderColor: Array(keyArr.length)
          .fill()
          .map(() => getRandomColor()), // Random border colors
        borderWidth: 2,
      },
    ],
  };
  return (
    <div className="chart">
      <Pie data={data} />
    </div>
  );
}
