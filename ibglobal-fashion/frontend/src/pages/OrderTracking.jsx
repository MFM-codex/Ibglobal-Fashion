import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

const STEPS = ["new", "in progress", "ready", "delivered"];

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLookup(e) {
    e?.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const data = await api.trackOrder(code.trim());
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (searchParams.get("code")) handleLookup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepIndex = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-ink mb-2">Track your order</h1>
      <p className="text-charcoal/60 mb-6">Enter the tracking code you received at checkout.</p>

      <form onSubmit={handleLookup} className="flex gap-3 mb-8">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. IBG-7F3K9Q"
          className="flex-1 border border-ink/20 px-3 py-2 text-sm uppercase"
        />
        <button type="submit" className="bg-ink text-parchment px-6 py-2 text-sm hover:bg-inkLight transition">
          {loading ? "Searching…" : "Track"}
        </button>
      </form>

      {error && <p className="text-wine text-sm mb-6">{error}</p>}

      {order && (
        <div className="border border-ink/10 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-charcoal/50">Tracking code</p>
              <p className="font-display text-lg text-ink">{order.trackingCode}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-charcoal/50">Placed</p>
              <p className="text-sm text-ink">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {order.status === "cancelled" ? (
            <p className="text-wine text-sm mb-6">This order was cancelled.</p>
          ) : (
            <div className="flex justify-between mb-8">
              {STEPS.map((step, i) => (
                <div key={step} className="flex-1 text-center relative">
                  <div
                    className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                      i <= stepIndex ? "bg-brass" : "bg-ink/15"
                    }`}
                  />
                  <p className={`text-xs capitalize ${i <= stepIndex ? "text-ink" : "text-charcoal/40"}`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          )}

          <ul className="space-y-2 mb-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-charcoal/70">
                  {item.name} {item.size && `(${item.size})`} × {item.qty}
                </span>
                <span className="text-ink">{formatNaira(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-ink/10 pt-3 font-medium text-ink">
            <span>Total</span>
            <span>{formatNaira(order.totalAmount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
