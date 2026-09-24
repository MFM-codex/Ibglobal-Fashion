require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { seedIfNeeded } = require("./utils/seed");

// Create the database with an admin account and sample products the first
// time the server runs. Safe to call every startup — it no-ops if the
// database already exists.
const created = seedIfNeeded();
if (created) {
  console.log("First run detected: database seeded with an admin account and sample products.");
  console.log(`Admin email: ${process.env.ADMIN_EMAIL || "admin@ibglobalfashion.com"}`);
  console.log("Admin password: whatever you set as ADMIN_PASSWORD in your .env file.");
}

if (!process.env.JWT_SECRET) {
  console.warn(
    "WARNING: JWT_SECRET is not set in your .env file. Admin logins will not work securely. " +
      "Copy .env.example to .env and set a real value."
  );
}

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const measurementRoutes = require("./routes/measurements");
const adminRoutes = require("./routes/admin");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", shop: "IBGLOBAL FASHION" });
});

// Public shop info the frontend can use (WhatsApp number, etc.)
app.get("/api/shop-info", (req, res) => {
  res.json({
    name: "IBGLOBAL FASHION",
    whatsappNumber: process.env.SHOP_WHATSAPP_NUMBER || "",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/measurements", measurementRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`IBGLOBAL FASHION API running at http://localhost:${PORT}`);
});
