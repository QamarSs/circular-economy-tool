import { Router } from "express";
import { randomUUID } from "crypto";
import db from "../db";

const router = Router();

const VALID_STAGES = ["idea", "design", "prototype", "finished_product"];

router.post("/", (req, res) => {
  const { name, category, developmentStage } = req.body || {};

  if (!name || !category || !developmentStage) {
    return res.status(400).json({ error: "name, category, and developmentStage are required." });
  }
  if (!VALID_STAGES.includes(developmentStage)) {
    return res.status(400).json({ error: `developmentStage must be one of: ${VALID_STAGES.join(", ")}` });
  }

  const id = randomUUID();
  db.prepare(
    "INSERT INTO products (id, name, category, development_stage) VALUES (?, ?, ?, ?)"
  ).run(id, name, category, developmentStage);

  res.status(201).json({ id, name, category, developmentStage });
});

router.get("/", (req, res) => {
  const { developmentStage } = req.query;
  let rows;
  if (developmentStage) {
    rows = db
      .prepare("SELECT id, name, category, development_stage as developmentStage, created_at as createdAt FROM products WHERE development_stage = ? ORDER BY created_at DESC")
      .all(developmentStage as string);
  } else {
    rows = db
      .prepare("SELECT id, name, category, development_stage as developmentStage, created_at as createdAt FROM products ORDER BY created_at DESC")
      .all();
  }
  res.json(rows);
});

export default router;
