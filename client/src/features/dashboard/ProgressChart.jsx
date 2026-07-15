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
  const scores = points.map((point) => Number(point.score || 0));
  const minScore = scores.length ? Math.max(0, Math.min(...scores) - 10) : 0;
  const maxScore = scores.length ? Math.min(100, Math.max(100, Math.max(...scores) + 10)) : 100;

  const chartData = {
    labels: points.map((point) => point.label),
    datasets: [
      {
        label: "Score",
        data: scores,
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
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => {
                const point = points[items[0]?.dataIndex];
                return point?.examTitle || point?.label || "";
              },
              label: (item) => `Score: ${item.raw}%`
            }
          }
        },
        scales: {
          y: { min: minScore, max: maxScore, ticks: { callback: (value) => `${value}%` } },
          x: {
            grid: { display: false },
            ticks: {
              callback(value) {
                const label = this.getLabelForValue(value);
                return label.length > 18 ? `${label.slice(0, 18)}...` : label;
              }
            }
          }
        }
      }}
    />
  );
}
