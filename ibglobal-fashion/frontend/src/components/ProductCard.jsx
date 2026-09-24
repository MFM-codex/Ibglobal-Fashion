import React from "react";
import { Link } from "react-router-dom";

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export default function ProductCard({ product }) {
  const image = product.images?.[0];

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="aspect-[3/4] bg-parchmentDark border border-ink/10 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 font-display text-sm">
            No photo yet
          </div>
        )}
      </div>
      <div className="pt-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-base text-ink leading-snug">{product.name}</h3>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-charcoal/70">{formatNaira(product.price)}</span>
          {product.madeToOrder && (
            <span className="text-[11px] uppercase tracking-wide2 text-brass">Made to order</span>
          )}
        </div>
      </div>
    </Link>
  );
}
