import { useEffect, useState } from "react";
import { api } from "./api";
import type { AssessmentResult, CategoryWithCriteria, ProductInput, ScoreEntry } from "./types";
import ProductForm from "./components/ProductForm";
import AssessmentForm from "./components/AssessmentForm";
import ResultsView from "./components/ResultsView";

type Step = "product" | "assessment" | "results";

export default function App() {
  const [step, setStep] = useState<Step>("product");
  const [categories, setCategories] = useState<CategoryWithCriteria[] | null>(null);
  const [product, setProduct] = useState<ProductInput | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getCriteria()
      .then(setCategories)
      .catch(() => setError("Could not load assessment criteria. Is the backend running?"));
  }, []);

  async function handleProductSubmit(p: ProductInput) {
    setProduct(p);
    setStep("assessment");
  }

  async function handleAssessmentSubmit(scores: ScoreEntry[]) {
    if (!product) return;
    setLoading(true);
    setError("");
    try {
      const created = await api.createAssessment(product, scores);
      const full = await api.getAssessment(created.id);
      setResult(full);
      setStep("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e.message || "Something went wrong while submitting the assessment.");
    } finally {
      setLoading(false);
    }
  }

  function handleStartOver() {
    setProduct(null);
    setResult(null);
    setStep("product");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg leading-tight">Circular Economy Potential Assessment</h1>
            <p className="text-xs text-gray-500">Measure the circularity potential of your product</p>
          </div>
          <nav className="hidden sm:flex gap-4 text-xs font-medium text-gray-400">
            <span className={step === "product" ? "text-brand-600" : ""}>1. Product</span>
            <span className={step === "assessment" ? "text-brand-600" : ""}>2. Assessment</span>
            <span className={step === "results" ? "text-brand-600" : ""}>3. Results</span>
          </nav>
        </div>
      </header>

      <main className="px-4 py-8">
        {error && (
          <div className="max-w-xl mx-auto mb-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {step === "product" && <ProductForm initial={product || undefined} onSubmit={handleProductSubmit} />}

        {step === "assessment" && categories && (
          <AssessmentForm categories={categories} onSubmit={handleAssessmentSubmit} onBack={() => setStep("product")} />
        )}

        {step === "assessment" && !categories && !error && (
          <p className="text-center text-gray-400 text-sm">Loading assessment criteria…</p>
        )}

        {loading && <p className="text-center text-gray-400 text-sm mt-6">Calculating results…</p>}

        {step === "results" && result && <ResultsView result={result} onStartOver={handleStartOver} />}
      </main>

      <footer className="text-center text-xs text-gray-400 py-8">
        Circular Economy Potential Assessment Tool — inspired by the CEPM (TU Braunschweig, IK)
      </footer>
    </div>
  );
}
