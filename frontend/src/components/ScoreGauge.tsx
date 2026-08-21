import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  score: number; // 0-100
  classification: "high" | "medium" | "low";
}

const CLASSIFICATION_META = {
  high: { color: "#16a34a", label: "High potential", emoji: "🟢" },
  medium: { color: "#ca8a04", label: "Medium potential", emoji: "🟡" },
  low: { color: "#dc2626", label: "Low potential", emoji: "🔴" },
};

export default function ScoreGauge({ score, classification }: Props) {
  const meta = CLASSIFICATION_META[classification];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 flex flex-col items-center">
      <h3 className="font-semibold self-start mb-3">Circular Score</h3>
      <div className="w-40 h-40">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            pathColor: meta.color,
            textColor: "#111827",
            trailColor: "#f3f4f6",
            textSize: "16px",
          })}
        />
      </div>
      <p className="mt-4 text-sm font-medium">
        {meta.emoji} {meta.label}
      </p>
      <p className="text-xs text-gray-400 mt-1 text-center">
        Current state achieves {score}% of the defined target circularity level.
      </p>
    </div>
  );
}
