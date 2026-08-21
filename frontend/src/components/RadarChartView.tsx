import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import type { ScoreWithGap } from "../types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  scores: ScoreWithGap[];
}

export default function RadarChartView({ scores }: Props) {
  const data = {
    labels: scores.map((s) => s.criterionName),
    datasets: [
      {
        label: "Current State (IST)",
        data: scores.map((s) => s.currentState),
        backgroundColor: "rgba(107, 114, 128, 0.15)",
        borderColor: "rgba(107, 114, 128, 0.9)",
        borderDash: [4, 4],
        pointBackgroundColor: "rgba(107, 114, 128, 0.9)",
      },
      {
        label: "Target State (SOLL)",
        data: scores.map((s) => s.targetState),
        backgroundColor: "rgba(22, 163, 74, 0.18)",
        borderColor: "rgba(21, 128, 61, 0.9)",
        pointBackgroundColor: "rgba(21, 128, 61, 0.9)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1, showLabelBackdrop: false, font: { size: 9 } },
        pointLabels: { font: { size: 9 } },
        grid: { color: "rgba(0,0,0,0.08)" },
      },
    },
    plugins: {
      legend: { position: "bottom" as const, labels: { font: { size: 11 } } },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="font-semibold mb-3">Circularity Profile</h3>
      <Radar data={data} options={options} />
    </div>
  );
}
