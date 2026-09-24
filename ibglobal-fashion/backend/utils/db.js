// Lightweight file-based "database" for this prototype.
//
// This project intentionally avoids a real database engine (Postgres, SQLite,
// etc.) so it can run anywhere Node runs with zero setup beyond `npm install`.
// All data lives in data/db.json and is read/written synchronously.
//
// For a production deployment, swap this module out for a real database —
// the routes only call the functions exported here, so that's the one file
// you'd need to replace. See README.md "Going to production" for notes.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// Generates a short, human-friendly order tracking code like "IBG-7F3K9Q"
function generateTrackingCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
  let code = "IBG-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

module.exports = { readDB, writeDB, generateTrackingCode };
