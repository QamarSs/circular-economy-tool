import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { AssessmentResult } from "../types";
import RadarChartView from "./RadarChartView";
import ScoreGauge from "./ScoreGauge";
import TopImprovements from "./TopImprovements";

interface Props {
  result: AssessmentResult;
  onStartOver: () => void;
}

const STAGE_LABELS: Record<string, string> = {
  idea: "Idea",
  design: "Design",
  prototype: "Prototype",
  finished_product: "Finished Product",
};

export default function ResultsView({ result, onStartOver }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleExportPdf() {
    if (!reportRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`${result.product.name.replace(/\s+/g, "_")}_CEPM_Report.pdf`);
    } finally {
      setExporting(false);
    }
  }

  function handleSaveLocally() {
    const key = "cepm_saved_assessments";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [
      { savedAt: new Date().toISOString(), result },
      ...existing.filter((e: any) => e.result.assessment.id !== result.assessment.id),
    ].slice(0, 20); // keep the most recent 20
    localStorage.setItem(key, JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div ref={reportRef} className="bg-gray-50 p-1">
        {/* Header / product info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
          <p className="text-xs uppercase tracking-wide text-brand-600 font-semibold mb-1">Assessment Result</p>
          <h1 className="text-2xl font-bold mb-2">{result.product.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
            <span>Category: <span className="text-gray-800 font-medium">{result.product.category}</span></span>
            <span>Stage: <span className="text-gray-800 font-medium">{STAGE_LABELS[result.product.developmentStage]}</span></span>
            <span>Date: <span className="text-gray-800 font-medium">{new Date(result.assessment.createdAt).toLocaleDateString()}</span></span>
          </div>
        </div>

        {/* Radar + Score */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <RadarChartView scores={result.scores} />
          <ScoreGauge score={result.assessment.overallScore} classification={result.assessment.classification} />
        </div>

        {/* Top 3 improvements + recommendations */}
        <div className="mb-6">
          <TopImprovements items={result.topImprovementAreas} />
        </div>
      </div>

      {/* Actions (outside the PDF capture area) */}
      <div className="flex flex-wrap gap-3 justify-center mt-2 mb-10">
        <button
          onClick={handleExportPdf}
          disabled={exporting}
          className="rounded-lg bg-brand-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-brand-700 disabled:opacity-60"
        >
          {exporting ? "Generating PDF…" : "Export to PDF"}
        </button>
        <button
          onClick={handleSaveLocally}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {saved ? "Saved ✓" : "Save Locally"}
        </button>
        <button
          onClick={onStartOver}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
}
