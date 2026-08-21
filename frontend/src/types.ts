export type DevelopmentStage = "idea" | "design" | "prototype" | "finished_product";

export interface ProductInput {
  name: string;
  category: string;
  developmentStage: DevelopmentStage;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  bestPractice: string;
}

export interface CategoryWithCriteria {
  id: string;
  name: string;
  criteria: Criterion[];
}

export interface ScoreEntry {
  criterionId: string;
  currentState: number; // 1-5
  targetState: number; // 1-5
}

export interface CreateAssessmentResponse {
  id: string;
  productId: string;
  overallScore: number;
}

export interface ScoreWithGap {
  criterionId: string;
  criterionName: string;
  description: string;
  bestPractice: string;
  categoryId: string;
  categoryName: string;
  currentState: number;
  targetState: number;
  gap: number;
}

export interface TopImprovementArea extends ScoreWithGap {
  rank: number;
  recommendations: string[];
}

export interface AssessmentResult {
  assessment: {
    id: string;
    createdAt: string;
    overallScore: number;
    classification: "high" | "medium" | "low";
  };
  product: {
    id: string;
    name: string;
    category: string;
    developmentStage: DevelopmentStage;
    createdAt: string;
  };
  scores: ScoreWithGap[];
  topImprovementAreas: TopImprovementArea[];
}
