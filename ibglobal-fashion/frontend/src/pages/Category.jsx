import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import ProductCard from "../components/ProductCard.jsx";

export default function Category() {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getProducts({ category: name })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [name]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-ink mb-2">{name}</h1>
      <div className="tape-rule w-24 mb-8" />

      {loading ? (
        <p className="text-charcoal/60 text-sm">Loading…</p>
      ) : products.length === 0 ? (
        <p className="text-charcoal/60 text-sm">No pieces in this category yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
