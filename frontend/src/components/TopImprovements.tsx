import { useState } from "react";
import type { TopImprovementArea } from "../types";

interface Props {
  items: TopImprovementArea[];
}

export default function TopImprovements({ items }: Props) {
  const [selectedId, setSelectedId] = useState<string>(items[0]?.criterionId || "");
  const selected = items.find((i) => i.criterionId === selectedId) || items[0];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="font-semibold mb-1">Top 3 Improvement Areas</h3>
      <p className="text-xs text-gray-500 mb-4">
        Criteria with the largest gap between current and target state — select one to see recommended actions.
      </p>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {items.map((item) => (
          <button
            key={item.criterionId}
            onClick={() => setSelectedId(item.criterionId)}
            className={`text-left rounded-xl border p-3 transition ${
              selectedId === item.criterionId
                ? "border-brand-600 bg-brand-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-400">#{item.rank}</span>
              <span className="text-xs font-semibold text-brand-700">Gap {item.gap}</span>
            </div>
            <p className="text-sm font-medium leading-snug">{item.criterionName}</p>
            <p className="text-[11px] text-gray-400 mt-1">{item.categoryName}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
          <h4 className="text-sm font-semibold mb-1">{selected.criterionName}</h4>
          <p className="text-xs text-gray-500 mb-3">
            Current: {selected.currentState}/5 → Target: {selected.targetState}/5 (Gap: {selected.gap})
          </p>
          <p className="text-xs font-semibold text-gray-600 mb-2">Suggested actions:</p>
          <ul className="space-y-1.5">
            {selected.recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex gap-2">
                <span className="text-brand-600">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
