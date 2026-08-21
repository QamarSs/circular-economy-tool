import express from "express";
import cors from "cors";
import "./db"; // initializes the SQLite database and applies the schema on boot
import criteriaRouter from "./routes/criteria";
import productsRouter from "./routes/products";
import assessmentsRouter from "./routes/assessments";

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/criteria", criteriaRouter);
app.use("/api/products", productsRouter);
app.use("/api/assessments", assessmentsRouter);

// Basic error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`CEPM backend listening on http://localhost:${PORT}`);
});
