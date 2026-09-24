const express = require("express");
const crypto = require("crypto");
const { readDB, writeDB } = require("../utils/db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/products?category=Suits&search=agbada
router.get("/", (req, res) => {
  const { category, search } = req.query;
  const db = readDB();
  let products = db.products;

  if (category) {
    products = products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (search) {
    const term = String(search).toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(term) || p.fabric.toLowerCase().includes(term)
    );
  }

  res.json(products);
});

// GET /api/products/categories - distinct category list, used for nav/filtering
router.get("/categories", (req, res) => {
  const db = readDB();
  const categories = [...new Set(db.products.map((p) => p.category))];
  res.json(categories);
});

// GET /api/products/:id - includes reviews
router.get("/:id", (req, res) => {
  const db = readDB();
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found." });

  const reviews = db.reviews.filter((r) => r.productId === product.id);
  const avgRating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : null;

  res.json({ ...product, reviews, avgRating });
});

// POST /api/products/:id/reviews - anyone can leave a review (no login required, like a storefront)
router.post("/:id/reviews", (req, res) => {
  const { name, rating, comment } = req.body || {};
  if (!name || !rating) {
    return res.status(400).json({ error: "Name and rating are required." });
  }
  const numericRating = Number(rating);
  if (numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5." });
  }

  const db = readDB();
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found." });

  const review = {
    id: crypto.randomUUID(),
    productId: product.id,
    name,
    rating: numericRating,
    comment: comment || "",
    createdAt: new Date().toISOString(),
  };
  db.reviews.push(review);
  writeDB(db);

  res.status(201).json(review);
});

// ---- Admin-only routes below ----

// POST /api/products (admin) - create product
router.post("/", requireAdmin, (req, res) => {
  const { name, category, price, sizes, fabric, quality, care, madeToOrder, inStock, description, images } =
    req.body || {};

  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: "Name, category, and price are required." });
  }

  const db = readDB();
  const product = {
    id: crypto.randomUUID(),
    name,
    category,
    price: Number(price),
    images: images || [],
    sizes: sizes || [],
    fabric: fabric || "",
    quality: quality || "",
    care: care || "",
    madeToOrder: Boolean(madeToOrder),
    inStock: inStock !== undefined ? Boolean(inStock) : true,
    description: description || "",
    createdAt: new Date().toISOString(),
  };

  db.products.push(product);
  writeDB(db);
  res.status(201).json(product);
});

// PUT /api/products/:id (admin) - update product
router.put("/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found." });

  const allowedFields = [
    "name",
    "category",
    "price",
    "images",
    "sizes",
    "fabric",
    "quality",
    "care",
    "madeToOrder",
    "inStock",
    "description",
  ];

  const updated = { ...db.products[index] };
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updated[field] = field === "price" ? Number(req.body[field]) : req.body[field];
    }
  }

  db.products[index] = updated;
  writeDB(db);
  res.json(updated);
});

// DELETE /api/products/:id (admin)
router.delete("/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found." });

  db.products.splice(index, 1);
  writeDB(db);
  res.status(204).send();
});

module.exports = router;
