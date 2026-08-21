import { Router } from "express";
import { randomUUID } from "crypto";
import db from "../db";

const router = Router();

type ScoreInput = { criterionId: string; currentState: number; targetState: number };

function isValidScore(n: unknown): n is number {
  return typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 5;
}

/**
 * Overall Circular Score = (sum of current states / sum of target states) * 100
 * This mirrors the requirement: it measures how much of the desired (target)
 * circularity level has already been reached today.
 */
function computeOverallScore(scores: ScoreInput[]): number {
  const sumCurrent = scores.reduce((s, x) => s + x.currentState, 0);
  const sumTarget = scores.reduce((s, x) => s + x.targetState, 0);
  if (sumTarget === 0) return 0;
  return Math.round((sumCurrent / sumTarget) * 10000) / 100; // 2 decimal places
}

function scoreClassification(score: number): "high" | "medium" | "low" {
  // Per requirements: 80-100% -> high potential already realized is the score itself;
  // classification bands describe how close current state is to target.
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
}

// POST /api/assessments
// Body: { product: { name, category, developmentStage }, scores: [{criterionId, currentState, targetState}] }
router.post("/", (req, res) => {
  const { product, scores } = req.body || {};

  if (!product || !product.name || !product.category || !product.developmentStage) {
    return res.status(400).json({ error: "product.name, product.category, and product.developmentStage are required." });
  }
  if (!Array.isArray(scores) || scores.length === 0) {
    return res.status(400).json({ error: "scores must be a non-empty array." });
  }
  for (const s of scores as ScoreInput[]) {
    if (!s.criterionId || !isValidScore(s.currentState) || !isValidScore(s.targetState)) {
      return res.status(400).json({ error: "Each score needs criterionId and currentState/targetState between 1 and 5." });
    }
  }

  const validStages = ["idea", "design", "prototype", "finished_product"];
  if (!validStages.includes(product.developmentStage)) {
    return res.status(400).json({ error: `developmentStage must be one of: ${validStages.join(", ")}` });
  }

  const overallScore = computeOverallScore(scores);

  const productId = randomUUID();
  const assessmentId = randomUUID();

  const tx = db.transaction(() => {
    db.prepare(
      "INSERT INTO products (id, name, category, development_stage) VALUES (?, ?, ?, ?)"
    ).run(productId, product.name, product.category, product.developmentStage);

    db.prepare(
      "INSERT INTO assessments (id, product_id, overall_score) VALUES (?, ?, ?)"
    ).run(assessmentId, productId, overallScore);

    const insertScore = db.prepare(
      "INSERT INTO assessment_scores (id, assessment_id, criterion_id, current_state, target_state) VALUES (?, ?, ?, ?, ?)"
    );
    for (const s of scores as ScoreInput[]) {
      insertScore.run(randomUUID(), assessmentId, s.criterionId, s.currentState, s.targetState);
    }
  });
  tx();

  res.status(201).json({ id: assessmentId, productId, overallScore });
});

// GET /api/assessments/:id — full results: product, radar data, score, top-3 gaps, recommendations
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const assessment = db
    .prepare("SELECT id, product_id as productId, overall_score as overallScore, created_at as createdAt FROM assessments WHERE id = ?")
    .get(id) as { id: string; productId: string; overallScore: number; createdAt: string } | undefined;

  if (!assessment) {
    return res.status(404).json({ error: "Assessment not found." });
  }

  const product = db
    .prepare("SELECT id, name, category, development_stage as developmentStage, created_at as createdAt FROM products WHERE id = ?")
    .get(assessment.productId);

  const rows = db
    .prepare(
      `SELECT
         ascore.criterion_id   as criterionId,
         c.name              as criterionName,
         c.description       as description,
         c.best_practice      as bestPractice,
         cat.id               as categoryId,
         cat.name              as categoryName,
         ascore.current_state   as currentState,
         ascore.target_state    as targetState
       FROM assessment_scores ascore
       JOIN criteria c   ON c.id = ascore.criterion_id
       JOIN categories cat ON cat.id = c.category_id
       WHERE ascore.assessment_id = ?
       ORDER BY cat.sort_order, c.sort_order`
    )
    .all(id) as {
    criterionId: string;
    criterionName: string;
    description: string;
    bestPractice: string;
    categoryId: string;
    categoryName: string;
    currentState: number;
    targetState: number;
  }[];

  const scoresWithGap = rows.map((r) => ({ ...r, gap: r.targetState - r.currentState }));

  const top3 = [...scoresWithGap]
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)
    .map((r, idx) => ({ rank: idx + 1, ...r }));

  // Attach recommended actions to each of the top-3 criteria
  const recStmt = db.prepare(
    "SELECT action_text as actionText FROM recommendations WHERE criterion_id = ? ORDER BY sort_order"
  );
  const top3WithRecommendations = top3.map((item) => ({
    ...item,
    recommendations: (recStmt.all(item.criterionId) as { actionText: string }[]).map((r) => r.actionText),
  }));

  res.json({
    assessment: { id: assessment.id, createdAt: assessment.createdAt, overallScore: assessment.overallScore, classification: scoreClassification(assessment.overallScore) },
    product,
    scores: scoresWithGap,
    topImprovementAreas: top3WithRecommendations,
  });
});

// GET /api/assessments/criteria/:criterionId/recommendations — recommendations for any single criterion
router.get("/criteria/:criterionId/recommendations", (req, res) => {
  const rows = db
    .prepare("SELECT action_text as actionText FROM recommendations WHERE criterion_id = ? ORDER BY sort_order")
    .all(req.params.criterionId);
  res.json(rows);
});

export default router;
