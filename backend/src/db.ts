import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "database", "cepm.sqlite");
const SCHEMA_PATH = path.join(__dirname, "..", "database", "schema.sql");

// Ensure the database directory exists before opening the file.
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Apply schema on every boot — CREATE TABLE IF NOT EXISTS makes this idempotent.
const schema = fs.readFileSync(SCHEMA_PATH, "utf-8");
db.exec(schema);

export default db;
