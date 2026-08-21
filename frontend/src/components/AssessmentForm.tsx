import { useMemo, useState } from "react";
import type { CategoryWithCriteria, ScoreEntry } from "../types";

interface Props {
  categories: CategoryWithCriteria[];
  onSubmit: (scores: ScoreEntry[]) => void;
  onBack: () => void;
}

const RATING_LABELS = ["Trifft gar nicht zu", "", "", "", "Trifft vollkommen zu"];

function RatingSlider({
  label,
  value,
  onChange,
  colorClass,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  colorClass: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className={`text-xs font-semibold ${colorClass}`}>{value} / 5</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600"
      />
      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
        <span>{RATING_LABELS[0]}</span>
        <span>{RATING_LABELS[4]}</span>
      </div>
    </div>
  );
}

export default function AssessmentForm({ categories, onSubmit, onBack }: Props) {
  const allCriteria = useMemo(() => categories.flatMap((c) => c.criteria), [categories]);

  const [scores, setScores] = useState<Record<string, { current: number; target: number }>>(() => {
    const initial: Record<string, { current: number; target: number }> = {};
    allCriteria.forEach((c) => (initial[c.id] = { current: 3, target: 4 }));
    return initial;
  });

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const activeCategory = categories[activeCategoryIndex];
  const isLastCategory = activeCategoryIndex === categories.length - 1;

  function updateScore(criterionId: string, field: "current" | "target", value: number) {
    setScores((prev) => ({ ...prev, [criterionId]: { ...prev[criterionId], [field]: value } }));
  }

  function handleNext() {
    if (isLastCategory) {
      const entries: ScoreEntry[] = allCriteria.map((c) => ({
        criterionId: c.id,
        currentState: scores[c.id].current,
        targetState: scores[c.id].target,
      }));
      onSubmit(entries);
    } else {
      setActiveCategoryIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePrev() {
    if (activeCategoryIndex === 0) {
      onBack();
    } else {
      setActiveCategoryIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Strategic field / category progress */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat, idx) => (
          <span
            key={cat.id}
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              idx === activeCategoryIndex
                ? "bg-brand-600 text-white"
                : idx < activeCategoryIndex
                ? "bg-brand-100 text-brand-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {cat.name}
          </span>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h2 className="text-xl font-semibold mb-1">{activeCategory.name}</h2>
        <p className="text-sm text-gray-500 mb-6">
          Rate the current state (IST) and target state (SOLL) for each criterion, from 1 (does not apply at all) to 5 (fully applies).
        </p>

        <div className="space-y-6">
          {activeCategory.criteria.map((criterion) => (
            <div key={criterion.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
              <h3 className="font-medium text-sm mb-1">{criterion.name}</h3>
              <p className="text-xs text-gray-500 mb-1">{criterion.description}</p>
              {criterion.bestPractice && (
                <p className="text-[11px] text-gray-400 mb-3">
                  <span className="font-semibold">Best practice: </span>
                  {criterion.bestPractice}
                </p>
              )}
              <div className="grid sm:grid-cols-2 gap-4 mt-3">
                <RatingSlider
                  label="Current state (IST)"
                  value={scores[criterion.id].current}
                  onChange={(v) => updateScore(criterion.id, "current", v)}
                  colorClass="text-gray-700"
                />
                <RatingSlider
                  label="Target state (SOLL)"
                  value={scores[criterion.id].target}
                  onChange={(v) => updateScore(criterion.id, "target", v)}
                  colorClass="text-brand-700"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            className="rounded-lg bg-brand-600 text-white px-5 py-2 text-sm font-medium hover:bg-brand-700"
          >
            {isLastCategory ? "See Results →" : "Next category →"}
          </button>
        </div>
      </div>
    </div>
  );
}
