import type {
  CategoryWithCriteria,
  ProductInput,
  ScoreEntry,
  CreateAssessmentResponse,
  AssessmentResult,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  getCriteria: () => request<CategoryWithCriteria[]>("/criteria"),

  createAssessment: (product: ProductInput, scores: ScoreEntry[]) =>
    request<CreateAssessmentResponse>("/assessments", {
      method: "POST",
      body: JSON.stringify({ product, scores }),
    }),

  getAssessment: (id: string) => request<AssessmentResult>(`/assessments/${id}`),
};
