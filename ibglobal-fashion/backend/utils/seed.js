// Creates data/db.json with an admin account and a handful of sample
// products if the database doesn't already exist. Safe to run more than
// once — it will never overwrite an existing database.

const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { hashPassword } = require("./password");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function seedIfNeeded() {
  if (fs.existsSync(DB_PATH)) {
    return false; // already seeded
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@ibglobalfashion.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";

  const now = new Date().toISOString();

  const data = {
    users: [
      {
        id: "admin-1",
        email: adminEmail,
        passwordHash: hashPassword(adminPassword),
        role: "admin",
        name: "Shop Admin",
      },
    ],
    products: [
      {
        id: "p1",
        name: "Agbada Grand Boubou",
        category: "Native Wear",
        price: 85000,
        images: [],
        sizes: [
          { size: "M", stock: 3 },
          { size: "L", stock: 5 },
          { size: "XL", stock: 2 },
        ],
        fabric: "Hand-woven Aso-Oke with silk lining",
        quality: "Premium — hand-finished seams, double-stitched hems",
        care: "Dry clean only. Store on a wide hanger to preserve embroidery.",
        madeToOrder: true,
        inStock: true,
        description:
          "A full three-piece agbada set with hand-embroidered neckline detail, tailored for a relaxed drape suited to formal occasions.",
        createdAt: now,
      },
      {
        id: "p2",
        name: "Classic Two-Piece Suit",
        category: "Suits",
        price: 120000,
        images: [],
        sizes: [
          { size: "38", stock: 2 },
          { size: "40", stock: 4 },
          { size: "42", stock: 3 },
        ],
        fabric: "Italian wool blend",
        quality: "Premium — half-canvas construction, hand-picked lapels",
        care: "Dry clean. Steam to remove travel creases.",
        madeToOrder: true,
        inStock: true,
        description:
          "A tailored two-piece suit cut close to the body with a soft shoulder line. Available made-to-measure.",
        createdAt: now,
      },
      {
        id: "p3",
        name: "Kaftan Everyday Shirt",
        category: "Casual Wear",
        price: 25000,
        images: [],
        sizes: [
          { size: "S", stock: 6 },
          { size: "M", stock: 8 },
          { size: "L", stock: 6 },
          { size: "XL", stock: 4 },
        ],
        fabric: "100% cotton",
        quality: "Standard — machine finished, reinforced buttons",
        care: "Machine wash cold, line dry.",
        madeToOrder: false,
        inStock: true,
        description:
          "A relaxed everyday kaftan shirt in breathable cotton, ready to wear off the shelf.",
        createdAt: now,
      },
      {
        id: "p4",
        name: "Junior Ankara Set",
        category: "Kids",
        price: 15000,
        images: [],
        sizes: [
          { size: "2-3Y", stock: 5 },
          { size: "4-5Y", stock: 5 },
          { size: "6-7Y", stock: 5 },
        ],
        fabric: "100% Ankara cotton print",
        quality: "Standard — flat-felled seams for durability",
        care: "Machine wash warm, tumble dry low.",
        madeToOrder: false,
        inStock: true,
        description:
          "A matching top-and-trouser Ankara set for children, built to survive a full day of play.",
        createdAt: now,
      },
    ],
    reviews: [
      {
        id: "r1",
        productId: "p3",
        name: "Chinedu A.",
        rating: 5,
        comment: "Fits true to size and the cotton feels solid. Will order another color.",
        createdAt: now,
      },
    ],
    orders: [],
    measurements: [],
  };

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  return true;
}

// Allow running directly with `npm run seed`
if (require.main === module) {
  const created = seedIfNeeded();
  if (created) {
    console.log("Database seeded at backend/data/db.json");
    console.log(`Admin login: ${process.env.ADMIN_EMAIL || "admin@ibglobalfashion.com"}`);
  } else {
    console.log("Database already exists — nothing to do. Delete backend/data/db.json to reseed.");
  }
}

module.exports = { seedIfNeeded };
