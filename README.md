# Circular Economy Potential Assessment Tool (CEPM)

A full-stack web app that lets users assess the circular-economy potential of a
product: enter product info, rate current (IST) vs. target (SOLL) state across
circularity criteria, and get a radar chart, an overall Circular Score, the
top 3 improvement areas, and suggested actions.

## Architecture

```
circular-economy-tool/
├── backend/     Node.js + Express + TypeScript + SQLite (better-sqlite3)
└── frontend/    React + TypeScript + Vite + Tailwind CSS + Chart.js
```

- **Database**: SQLite file, schema in `backend/database/schema.sql`.
  Tables: `categories`, `criteria`, `recommendations`, `products`,
  `assessments`, `assessment_scores`.
- **API**: REST endpoints under `/api` (see below).
- **Frontend**: 3-step wizard (Product → Assessment → Results), talks to the
  API over `fetch`.

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed     # populates categories/criteria/recommendations (once)
npm run dev       # starts the API on http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # set VITE_API_BASE_URL if the backend runs elsewhere
npm install
npm run dev             # starts the app on http://localhost:5173
```

Open http://localhost:5173 in your browser.

## API Reference

| Method | Path                                              | Description                                               |
|--------|---------------------------------------------------|-------------------------------------------------------------|
| GET    | `/api/health`                                     | Health check                                               |
| GET    | `/api/criteria`                                   | All categories with nested criteria (for the assessment form) |
| POST   | `/api/products`                                   | Create a standalone product record                          |
| GET    | `/api/products`                                   | List products, optional `?developmentStage=` filter         |
| POST   | `/api/assessments`                                | Create product + assessment + scores in one call            |
| GET    | `/api/assessments/:id`                            | Full results: product, scores/gaps, score, top-3 areas + recommendations |
| GET    | `/api/assessments/criteria/:criterionId/recommendations` | Recommended actions for a single criterion            |

### Example: create an assessment

```http
POST /api/assessments
Content-Type: application/json

{
  "product": {
    "name": "Electric Delivery Van",
    "category": "Commercial Vehicle",
    "developmentStage": "prototype"
  },
  "scores": [
    { "criterionId": "<uuid>", "currentState": 2, "targetState": 5 },
    { "criterionId": "<uuid>", "currentState": 3, "targetState": 4 }
  ]
}
```

Response:
```json
{ "id": "<assessment-id>", "productId": "<product-id>", "overallScore": 62.5 }
```

## Scoring logic

- **Gap** per criterion = `targetState - currentState`
- **Overall Circular Score** = `(sum of currentState / sum of targetState) * 100`
- **Classification**:
  - 🟢 80–100% → High potential
  - 🟡 50–79% → Medium potential
  - 🔴 0–49% → Low potential
- **Top 3 improvement areas** = the 3 criteria with the largest gap.

## Deployment

- **Frontend**: build with `npm run build` in `frontend/`, deploy the `dist/`
  folder to Vercel or GitHub Pages. Set `VITE_API_BASE_URL` to your deployed
  backend URL as an environment variable at build time.
- **Backend**: deploy `backend/` to any Node host (Render, Railway, Fly.io,
  a VPS, etc.) that supports a persistent filesystem for the SQLite file —
  or swap `better-sqlite3` for a hosted Postgres/MySQL driver if you need a
  fully managed database (the SQL schema translates directly).

## Notes on extensibility

- Add or edit criteria/recommendations by editing `backend/src/seed.ts` and
  re-running `npm run seed` against a fresh database (delete
  `database/cepm.sqlite` first, since seeding only runs on an empty table).
- The frontend's "Save Locally" button stores the last 20 results in the
  browser's `localStorage` under the key `cepm_saved_assessments`.
- "Export to PDF" renders the results panel (radar chart, score gauge, top 3
  + recommendations) to a PDF using `html2canvas` + `jspdf`.
