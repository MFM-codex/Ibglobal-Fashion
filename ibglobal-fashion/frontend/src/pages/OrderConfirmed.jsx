import React from "react";
import { Link, useParams } from "react-router-dom";

export default function OrderConfirmed() {
  const { trackingCode } = useParams();

  return (
    <div className="max-w-xl mx-auto px-5 py-20 text-center">
      <p className="text-brass text-sm tracking-wide2 mb-3">Order placed</p>
      <h1 className="font-display text-3xl text-ink mb-4">Thank you — we've got your order.</h1>
      <p className="text-charcoal/70 mb-6">
        Save this tracking code to check your order's progress at any time:
      </p>
      <p className="font-display text-2xl text-ink border border-brass/40 bg-brass/5 py-4 mb-8">
        {trackingCode}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to={`/track-order?code=${trackingCode}`} className="bg-ink text-parchment px-6 py-3 text-sm hover:bg-inkLight transition">
          Track this order
        </Link>
        <Link to="/" className="border border-ink/20 px-6 py-3 text-sm hover:border-brass transition">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
