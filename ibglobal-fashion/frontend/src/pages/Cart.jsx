import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export default function Cart() {
  const { items, updateQty, removeItem, totalAmount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-2xl text-ink mb-3">Your cart is empty</h1>
        <p className="text-charcoal/60 mb-6">Browse the catalogue and add a piece you like.</p>
        <Link to="/" className="bg-ink text-parchment px-6 py-3 text-sm inline-block hover:bg-inkLight transition">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-ink mb-6">Your cart</h1>
      <ul className="divide-y divide-ink/10 border-t border-b border-ink/10">
        {items.map((item) => (
          <li key={`${item.productId}-${item.size}`} className="py-4 flex gap-4 items-center">
            <div className="w-16 h-20 bg-parchmentDark border border-ink/10 shrink-0 overflow-hidden">
              {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink text-sm">{item.name}</p>
              {item.size && <p className="text-xs text-charcoal/50">Size {item.size}</p>}
              <p className="text-sm text-charcoal/70 mt-1">{formatNaira(item.price)}</p>
            </div>
            <div className="flex items-center border border-ink/20">
              <button
                onClick={() => updateQty(item.productId, item.size, item.qty - 1)}
                className="px-2 py-1"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-3 text-sm">{item.qty}</span>
              <button
                onClick={() => updateQty(item.productId, item.size, item.qty + 1)}
                className="px-2 py-1"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.productId, item.size)}
              className="text-xs text-wine hover:underline ml-2"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-6">
        <span className="font-display text-xl text-ink">Total</span>
        <span className="font-display text-xl text-ink">{formatNaira(totalAmount)}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full bg-ink text-parchment py-3 text-sm font-medium mt-6 hover:bg-inkLight transition"
      >
        Proceed to checkout
      </button>
    </div>
  );
}
