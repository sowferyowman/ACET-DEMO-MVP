import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export default function ProgressChart({ points }) {
  const chartData = {
    labels: points.map((point) => point.label),
    datasets: [
      {
        label: "Score",
        data: points.map((point) => point.score),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.12)",
        fill: true,
        tension: 0.35,
        pointBackgroundColor: "#003A6C",
        pointRadius: 4
      }
    ]
  };

  return (
    <Line
      data={chartData}
      options={{
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 40, max: 100, ticks: { callback: (value) => `${value}%` } },
          x: { grid: { display: false } }
        }
      }}
    />
  );
}
