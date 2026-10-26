import { useState } from "react";
import type { ProductInput, DevelopmentStage } from "../types";

const STAGES: { value: DevelopmentStage; label: string }[] = [
  { value: "idea", label: "Idea" },
  { value: "design", label: "Design" },
  { value: "prototype", label: "Prototype" },
  { value: "finished_product", label: "Finished Product" },
];

interface Props {
  initial?: ProductInput;
  onSubmit: (product: ProductInput) => void;
}

export default function ProductForm({ initial, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name || "");
  const [category, setCategory] = useState(initial?.category || "");
  const [developmentStage, setDevelopmentStage] = useState<DevelopmentStage>(
    initial?.developmentStage || "idea"
  );
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !category.trim()) {
      setError("Please fill in both product name and category.");
      return;
    }
    setError("");
    onSubmit({ name: name.trim(), category: category.trim(), developmentStage });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid max-w-6xl gap-8 rounded-panel border border-line bg-white p-5 shadow-card sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:p-10"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Product profile</p>
        <h3 className="mt-2 font-editorial text-2xl font-bold sm:text-3xl">Set the scene.</h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          Capture the essentials before exploring where circular design can make a difference.
        </p>
        <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paleRed text-sm font-bold text-tubs-red">1</span>
          <p className="text-xs leading-5 text-muted">Your information stays with this assessment.</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="name">Product name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Electric Delivery Van"
            className="w-full rounded-md border border-line bg-canvas px-3.5 py-3 text-sm transition focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="category">Product category</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Commercial Vehicle"
            className="w-full rounded-md border border-line bg-canvas px-3.5 py-3 text-sm transition focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Product development stage</label>
          <div className="grid grid-cols-2 gap-3">
            {STAGES.map((stage) => (
              <button
                type="button"
                key={stage.value}
                onClick={() => setDevelopmentStage(stage.value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  developmentStage === stage.value
                    ? "border-brand-600 bg-brand-50 text-brand-700 shadow-soft"
                    : "border-line bg-white text-gray-600 hover:border-brand-600/50"
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="rounded-lg bg-paleRed px-3 py-2 text-sm text-tubs-red">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-md bg-brand-600 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
        >
          Continue to Assessment →
        </button>
      </div>
    </form>
  );
}
