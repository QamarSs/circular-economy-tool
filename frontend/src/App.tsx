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
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-xs font-bold tracking-wide text-white shadow-soft">
              CEPM
              <span className="absolute bottom-0 left-0 top-0 w-1 rounded-l-xl bg-tubs-red" />
            </div>
            <div className="max-w-[125px] sm:max-w-none">
              <h1 className="truncate text-xs font-bold leading-tight sm:text-base">Circular Economy Potential Model</h1>
              <p className="hidden text-[11px] uppercase tracking-[0.16em] text-muted sm:block">Product assessment</p>
            </div>
          </div>
          <nav aria-label="Assessment progress" className="flex items-center gap-1.5 sm:gap-2">
            {([
              ["product", "01", "Product"],
              ["assessment", "02", "Assessment"],
              ["results", "03", "Results"],
            ] as const).map(([key, number, label], index) => {
              const active = step === key;
              const completed =
                (step === "assessment" && index === 0) || (step === "results" && index < 2);
              return (
                <span
                  key={key}
                  aria-current={active ? "step" : undefined}
                  className={`flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[10px] font-semibold sm:px-3 sm:text-xs ${
                    active
                      ? "bg-brand-50 text-brand-700"
                      : completed
                      ? "text-tubs-red"
                      : "text-gray-400"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] ${
                      active
                        ? "bg-brand-600 text-white"
                        : completed
                        ? "bg-paleRed text-tubs-red"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {number}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </span>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-9">
        {error && (
          <div className="mx-auto mb-6 max-w-3xl rounded-xl border border-tubs-red/20 bg-paleRed px-4 py-3 text-sm text-tubs-red">
            {error}
          </div>
        )}

        {step === "product" && (
          <>
            <section className="relative isolate overflow-hidden rounded-panel bg-slateHero px-6 py-10 text-white shadow-card sm:px-10 sm:py-16 lg:px-14">
              <div className="absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full border border-white/15 sm:right-8 sm:top-1/2 sm:h-[34rem] sm:w-[34rem] sm:-translate-y-1/2">
                <div className="absolute inset-8 rounded-full border border-white/20" />
                <div className="absolute inset-16 rounded-full border border-white/20" />
                <div className="absolute inset-24 rounded-full border border-white/20" />
                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tubs-red shadow-[0_0_0_10px_rgba(255,255,255,0.13)]" />
              </div>
              <div className="absolute inset-y-0 left-0 w-1.5 bg-tubs-red" />
              <div className="max-w-3xl">
                <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  Design &amp; decision support
                </p>
                <h2 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                  Measure what
                  <br />
                  <span className="font-editorial font-normal italic">can circulate.</span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
                  Discover the circular potential of your product. Turn a clear assessment into practical design
                  decisions for a more resource-conscious future.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#product-form"
                    className="inline-flex min-h-12 items-center justify-center rounded-md border-2 border-brand-600 bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-brand-700"
                  >
                    Start your assessment
                  </a>
                  <a
                    href="#how-it-works"
                    className="inline-flex min-h-12 items-center justify-center rounded-md border-2 border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                  >
                    Explore the process
                  </a>
                </div>
              </div>
              <div className="mt-10 flex items-center gap-3 border-t border-white/20 pt-5 text-xs text-white/75 sm:mt-14">
                <span className="h-1 w-8 bg-tubs-red" />
                Circularity · Product development · Evidence-led decisions
              </div>
            </section>

            <section id="how-it-works" className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-3">
              {[
                ["01", "Set your baseline", "Add your product context and development stage."],
                ["02", "Assess circularity", "Compare current and target performance across key criteria."],
                ["03", "Act on the results", "Explore your circular profile and prioritized improvements."],
              ].map(([number, title, description], index) => (
                <div key={number} className="bg-white p-5 sm:p-6">
                  <span className={`text-xs font-bold tracking-[0.16em] ${index === 0 ? "text-tubs-red" : "text-brand-600"}`}>
                    {number} / 03
                  </span>
                  <h3 className="mt-3 text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted">{description}</p>
                </div>
              ))}
            </section>

            <div id="product-form" className="scroll-mt-24 pt-12 sm:pt-16">
              <div className="mb-6 max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-tubs-red">01 / Product context</p>
                <h2 className="mt-2 font-editorial text-3xl font-bold tracking-tight sm:text-4xl">Begin with your product.</h2>
                <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
                  A few details help frame your assessment and make the results easier to act on.
                </p>
              </div>
              <ProductForm initial={product || undefined} onSubmit={handleProductSubmit} />
            </div>
          </>
        )}

        {step === "assessment" && categories && (
          <AssessmentForm categories={categories} onSubmit={handleAssessmentSubmit} onBack={() => setStep("product")} />
        )}

        {step === "assessment" && !categories && !error && (
          <p className="text-center text-gray-500 text-sm">Loading assessment criteria…</p>
        )}

        {loading && <p className="mt-6 text-center text-gray-500 text-sm">Calculating results…</p>}

        {step === "results" && result && <ResultsView result={result} onStartOver={handleStartOver} />}
      </main>

      <footer className="border-t border-line bg-white px-4 py-7 text-center text-xs text-muted">
        <span className="font-semibold text-ink">CEPM</span> · Research prototype
        <span className="mx-2 text-tubs-red">|</span>
        Visual language inspired by InnoLink · Accent inspired by TU Braunschweig
      </footer>
    </div>
  );
}
