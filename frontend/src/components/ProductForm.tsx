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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <h2 className="text-xl font-semibold mb-1">Product Information</h2>
      <p className="text-sm text-gray-500 mb-6">Tell us about the product you want to assess.</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Product name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Electric Delivery Van"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="category">Product category</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Commercial Vehicle"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Product development stage</label>
          <div className="grid grid-cols-2 gap-3">
            {STAGES.map((stage) => (
              <button
                type="button"
                key={stage.value}
                onClick={() => setDevelopmentStage(stage.value)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  developmentStage === stage.value
                    ? "border-brand-600 bg-brand-50 text-brand-700"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 text-white font-medium py-2.5 hover:bg-brand-700 transition"
        >
          Continue to Assessment →
        </button>
      </div>
    </form>
  );
}
