const express = require("express");
const crypto = require("crypto");
const { readDB, writeDB, generateTrackingCode } = require("../utils/db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

const VALID_STATUSES = ["new", "in progress", "ready", "delivered", "cancelled"];

// POST /api/orders - place an order (checkout)
router.post("/", (req, res) => {
  const { items, customer, deliveryMethod, paymentMethod } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }
  if (!customer || !customer.name || !customer.phone) {
    return res.status(400).json({ error: "Customer name and phone number are required." });
  }
  if (deliveryMethod === "delivery" && !customer.address) {
    return res.status(400).json({ error: "An address is required for delivery orders." });
  }
  if (!["card", "bank transfer", "cash on delivery"].includes(paymentMethod)) {
    return res.status(400).json({ error: "Please choose a valid payment method." });
  }

  const db = readDB();

  // Re-price server-side from the product catalog so the client can't tamper with totals.
  let totalAmount = 0;
  const orderItems = items.map((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    const qty = Math.max(1, Number(item.qty) || 1);
    totalAmount += product.price * qty;
    return {
      productId: product.id,
      name: product.name,
      size: item.size || null,
      qty,
      price: product.price,
    };
  });

  let trackingCode = generateTrackingCode();
  while (db.orders.some((o) => o.trackingCode === trackingCode)) {
    trackingCode = generateTrackingCode();
  }

  const order = {
    id: crypto.randomUUID(),
    trackingCode,
    items: orderItems,
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
    },
    deliveryMethod: deliveryMethod === "pickup" ? "pickup" : "delivery",
    paymentMethod,
    status: "new",
    totalAmount,
    createdAt: new Date().toISOString(),
  };

  db.orders.push(order);
  writeDB(db);

  res.status(201).json(order);
});

// GET /api/orders/track/:trackingCode - public order lookup (no login needed)
router.get("/track/:trackingCode", (req, res) => {
  const db = readDB();
  const order = db.orders.find(
    (o) => o.trackingCode.toLowerCase() === req.params.trackingCode.toLowerCase()
  );
  if (!order) return res.status(404).json({ error: "No order found with that tracking code." });
  res.json(order);
});

// ---- Admin-only routes below ----

// GET /api/orders (admin) - list all orders, optional ?status= filter
router.get("/", requireAdmin, (req, res) => {
  const db = readDB();
  let orders = [...db.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (req.query.status) {
    orders = orders.filter((o) => o.status === req.query.status);
  }
  res.json(orders);
});

// PUT /api/orders/:id/status (admin) - move an order through its lifecycle
router.put("/:id/status", requireAdmin, (req, res) => {
  const { status } = req.body || {};
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` });
  }

  const db = readDB();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found." });

  order.status = status;
  writeDB(db);
  res.json(order);
});

module.exports = router;
