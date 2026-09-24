const express = require("express");
const crypto = require("crypto");
const { readDB, writeDB } = require("../utils/db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const VALID_STATUSES = ["new", "reviewed", "in progress", "completed"];

// POST /api/measurements - customer submits a custom / made-to-measure request
router.post("/", (req, res) => {
  const { name, phone, email, productId, notes, measurements } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone number are required." });
  }

  const db = readDB();

  const request = {
    id: crypto.randomUUID(),
    name,
    phone,
    email: email || "",
    productId: productId || null,
    notes: notes || "",
    measurements: measurements || {}, // e.g. { chest, waist, hip, shoulder, sleeve, length }
    status: "new",
    createdAt: new Date().toISOString(),
  };

  db.measurements.push(request);
  writeDB(db);

  res.status(201).json(request);
});

// GET /api/measurements (admin)
router.get("/", requireAdmin, (req, res) => {
  const db = readDB();
  const requests = [...db.measurements].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json(requests);
});

// PUT /api/measurements/:id/status (admin)
router.put("/:id/status", requireAdmin, (req, res) => {
  const { status } = req.body || {};
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
  }

  const db = readDB();
  const request = db.measurements.find((m) => m.id === req.params.id);
  if (!request) return res.status(404).json({ error: "Request not found." });

  request.status = status;
  writeDB(db);
  res.json(request);
});

module.exports = router;
