import { Router } from "express";
import db from "../db";

const router = Router();

// GET /api/criteria — all categories with their nested criteria (for the assessment form)
router.get("/", (_req, res) => {
  const categories = db
    .prepare("SELECT id, name FROM categories ORDER BY sort_order")
    .all() as { id: string; name: string }[];

  const criteriaStmt = db.prepare(
    "SELECT id, name, description, best_practice as bestPractice FROM criteria WHERE category_id = ? ORDER BY sort_order"
  );

  const result = categories.map((cat) => ({
    ...cat,
    criteria: criteriaStmt.all(cat.id),
  }));

  res.json(result);
});

export default router;
