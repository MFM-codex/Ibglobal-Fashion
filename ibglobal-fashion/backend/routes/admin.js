const express = require("express");
const { readDB } = require("../utils/db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/dashboard - quick stats for the admin home screen
router.get("/dashboard", requireAdmin, (req, res) => {
  const db = readDB();

  const totalOrders = db.orders.length;
  const totalRevenue = db.orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = db.orders.filter((o) => o.status === "new" || o.status === "in progress").length;
  const pendingMeasurements = db.measurements.filter((m) => m.status === "new").length;

  const recentOrders = [...db.orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const lowStockProducts = db.products.filter((p) =>
    p.sizes.some((s) => s.stock <= 2)
  ).length;

  res.json({
    totalOrders,
    totalRevenue,
    pendingOrders,
    pendingMeasurements,
    lowStockProducts,
    totalProducts: db.products.length,
    recentOrders,
  });
});

module.exports = router;
