-- Circular Economy Potential Model (CEPM) — Database Schema

CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS criteria (
  id            TEXT PRIMARY KEY,
  category_id   TEXT NOT NULL REFERENCES categories(id),
  name          TEXT NOT NULL,
  description   TEXT NOT NULL DEFAULT '',
  best_practice TEXT NOT NULL DEFAULT '',
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS recommendations (
  id           TEXT PRIMARY KEY,
  criterion_id TEXT NOT NULL REFERENCES criteria(id),
  action_text  TEXT NOT NULL,
  sort_order   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  category            TEXT NOT NULL,
  development_stage   TEXT NOT NULL CHECK (development_stage IN ('idea','design','prototype','finished_product')),
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS assessments (
  id           TEXT PRIMARY KEY,
  product_id   TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  overall_score REAL NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS assessment_scores (
  id             TEXT PRIMARY KEY,
  assessment_id  TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  criterion_id   TEXT NOT NULL REFERENCES criteria(id),
  current_state  INTEGER NOT NULL CHECK (current_state BETWEEN 1 AND 5),
  target_state   INTEGER NOT NULL CHECK (target_state BETWEEN 1 AND 5)
);

CREATE INDEX IF NOT EXISTS idx_criteria_category ON criteria(category_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_criterion ON recommendations(criterion_id);
CREATE INDEX IF NOT EXISTS idx_assessments_product ON assessments(product_id);
CREATE INDEX IF NOT EXISTS idx_scores_assessment ON assessment_scores(assessment_id);
