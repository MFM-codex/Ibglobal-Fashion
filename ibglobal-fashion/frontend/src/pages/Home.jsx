import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import ProductCard from "../components/ProductCard.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.getProducts().then(setProducts).catch(() => {});
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink text-parchment">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-24 grid md:grid-cols-5 gap-10 items-end">
          <div className="md:col-span-3">
            <p className="text-brass text-sm tracking-wide2 mb-4">IBGLOBAL FASHION — Lagos atelier</p>
            <h1 className="font-display text-4xl md:text-5xl leading-[1.1] text-parchment">
              Garments cut to your measure, finished by hand.
            </h1>
            <p className="mt-5 text-parchment/75 max-w-md">
              Ready-to-wear pieces you can order today, and made-to-measure agbada, suits and
              kaftans built from the fabric and fit you choose.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/category/Native%20Wear"
                className="bg-brass text-ink px-6 py-3 text-sm font-medium hover:bg-brassLight transition"
              >
                Shop ready-to-wear
              </Link>
              <Link
                to="/custom-order"
                className="border border-parchment/40 text-parchment px-6 py-3 text-sm font-medium hover:border-brass hover:text-brassLight transition"
              >
                Start a custom order
              </Link>
            </div>
          </div>
          <div className="md:col-span-2 hidden md:block">
            <div className="border border-brass/40 p-6">
              <p className="font-display text-lg text-brassLight mb-3">What "made to measure" means here</p>
              <ul className="space-y-2 text-sm text-parchment/75">
                <li>You send chest, waist, shoulder and length measurements.</li>
                <li>We confirm fabric and fit before cutting begins.</li>
                <li>Your piece is hand-finished and ready for pickup or delivery.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="tape-rule" />

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-5 py-14">
        <h2 className="font-display text-2xl text-ink mb-6">Shop by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/category/${encodeURIComponent(cat)}`}
              className="border border-ink/15 px-4 py-8 text-center hover:border-brass hover:bg-parchmentDark transition"
            >
              <span className="font-display text-base text-ink">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-ink">New this season</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="text-charcoal/60 text-sm">No products yet — add some from the admin panel.</p>
        )}
      </section>
    </div>
  );
}
