---
name: circular-economy-assessment
description: "Use when developing, debugging, documenting, or deploying this Circular Economy Potential Assessment Tool, including React assessment/results views, circular charts, scoring, Express API, SQLite data, PDF export, and project setup."
---

# Circular Economy Potential Assessment Tool

Use this skill for full-stack work in this repository. Keep the user flow, assessment data contract, backend calculations, results visualizations, and exported report consistent.

## Product behavior

This tool collects product name, category, and development stage; lets users rate circular-economy criteria for current state (IST) and target state (SOLL), each on a 1–5 scale; and displays a results report with a circular criterion profile, category radar, score gauge, and prioritized recommendations.

The results page is also the PDF report body. The report includes the product summary, circular profile, supporting radar and score gauge, and top improvement recommendations. Keep report content inside `reportRef` in `ResultsView.tsx`.

## Architecture

- `frontend/src/App.tsx`: three-step Product → Assessment → Results flow and API state.
- `frontend/src/components/ProductForm.tsx`: product metadata and development stage.
- `frontend/src/components/AssessmentForm.tsx`: category-grouped scoring questions.
- `frontend/src/components/ResultsView.tsx`: report composition, local save, PDF export, and new-assessment action.
- `frontend/src/components/CircularRadarProfile.tsx`: reference-style annular results chart with criterion segments, category groups, 1–5 rings, and current/target polygons.
- `frontend/src/index.css` and `frontend/tailwind.config.js`: shared typography, accessibility focus states, motion preference, and brand color tokens.
- `frontend/src/components/RadarChartView.tsx`: supporting criterion-level radar visualization.
- `frontend/src/components/ScoreGauge.tsx`: overall score and classification.
- `frontend/src/components/TopImprovements.tsx`: top improvement criteria and recommendations.
- `frontend/src/types.ts`: frontend domain and API response contracts.
- `frontend/src/api.ts`: typed HTTP client.
- `backend/src/routes/assessments.ts`: create/read assessment endpoints.
- `backend/src/routes/criteria.ts` and `products.ts`: criteria and product endpoints.
- `backend/src/seed.ts`: initial category, criterion, and recommendation data.
- `backend/src/db.ts` and `backend/database/schema.sql`: SQLite connection and schema.

The frontend API base is `VITE_API_BASE_URL` or `http://localhost:4000/api`. The backend is Express + TypeScript + SQLite; the frontend is React + TypeScript + Vite + Tailwind + Chart.js.

## Assessment data and scoring

The assessment payload uses product fields `{ name, category, developmentStage }` and score entries `{ criterionId, currentState, targetState }`. Result score entries contain criterion/category names, `currentState`, `targetState`, and `gap`.

- Criterion gap is `targetState - currentState`.
- Overall score is `(sum(currentState) / sum(targetState)) * 100`.
- The classification is high (80–100%), medium (50–79%), or low (0–49%).
- Top improvement areas are the three largest gaps.

When changing request/response behavior, update `frontend/src/types.ts`, the API client, backend routes, database interaction, and all UI consumers together. Preserve rating validation and existing score semantics.

## Circular profile requirements

- Build the chart from the live `ScoreWithGap[]` result data; do not hard-code category or criterion names/counts.
- Group adjacent criterion slices by their `categoryName`; assign a consistent muted category color.
- Include concentric rating rings numbered 1–5 and distinguish current and target polygons, points, and legend entries.
- Render criterion text in an outer annular band and category labels in the inner category ring. Retain full names in SVG titles when visual labels are wrapped.
- Keep the SVG responsive and inside the PDF capture ref.
- If there are no scores, render safely without crashing.
- Check label readability at the seeded criterion count and at narrow viewport widths.

## Frontend conventions

- Use React function components and TypeScript; prefer existing project types over duplicate interfaces.
- Follow the double-quoted TSX style used in the frontend.
- Use Tailwind utility classes and the shared theme tokens. The InnoLink-inspired palette uses slate gray `#96959F`, blue `#2F5AAE`, warm off-white surfaces, and restrained TU Braunschweig-inspired red `#A6192E`.
- Keep the product landing page's primary CTA linked to the product form and the process link anchored to the process section.
- Preserve visible keyboard focus, responsive horizontal layouts, and reduced-motion preferences.
- Keep local storage key `cepm_saved_assessments` and leave report action buttons outside the PDF capture area.
- Surface errors explicitly; do not silently suppress API or export failures.

## Development and validation

Run the frontend from `frontend/`:

```powershell
npm ci
npm run build
npm run dev
```

Run the backend from `backend/`:

```powershell
npm ci
npm run build
npm run seed
npm run dev
```

For results visual changes, verify the production frontend build and confirm the chart is part of the results component and PDF capture container. Avoid re-seeding a user database unless explicitly requested; `seed.ts` is for initial/fresh database setup.

## Deployment notes

- The production frontend must be rebuilt and redeployed for source changes to appear on Vercel.
- Set `VITE_API_BASE_URL` to the deployed backend API URL at frontend build time.
- The backend SQLite database needs persistent storage.
- Review `README.md` for setup, endpoint contracts, scoring, and deployment instructions.
