import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api";

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

const initialForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  deliveryMethod: "delivery",
  paymentMethod: "cash on delivery",
};

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const order = await api.createOrder({
        items: items.map((i) => ({ productId: i.productId, size: i.size, qty: i.qty })),
        customer: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.deliveryMethod === "delivery" ? form.address : "",
        },
        deliveryMethod: form.deliveryMethod,
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      navigate(`/order-confirmed/${order.trackingCode}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-ink mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <Field label="Full name">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-ink/20 px-3 py-2 text-sm"
            />
          </Field>
          <Field label="Phone number">
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-ink/20 px-3 py-2 text-sm"
              placeholder="e.g. 08012345678"
            />
          </Field>
          <Field label="Email (optional)">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-ink/20 px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Delivery method">
            <div className="flex gap-3">
              {["delivery", "pickup"].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setForm({ ...form, deliveryMethod: method })}
                  className={`flex-1 border px-3 py-2 text-sm capitalize ${
                    form.deliveryMethod === method ? "border-brass bg-brass/10" : "border-ink/20"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </Field>

          {form.deliveryMethod === "delivery" && (
            <Field label="Delivery address">
              <textarea
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border border-ink/20 px-3 py-2 text-sm"
                rows={3}
              />
            </Field>
          )}

          <Field label="Payment method">
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              className="w-full border border-ink/20 px-3 py-2 text-sm"
            >
              <option value="cash on delivery">Cash on delivery</option>
              <option value="bank transfer">Bank transfer</option>
              <option value="card">Card</option>
            </select>
            {form.paymentMethod === "bank transfer" && (
              <p className="text-xs text-charcoal/60 mt-2">
                Bank details will be sent to you by WhatsApp or phone after you place the order.
              </p>
            )}
            {form.paymentMethod === "card" && (
              <p className="text-xs text-charcoal/60 mt-2">
                Card payment is a placeholder in this prototype — connect a payment gateway (e.g. Paystack
                or Flutterwave) before taking real card payments.
              </p>
            )}
          </Field>

          {error && <p className="text-wine text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-parchment py-3 text-sm font-medium hover:bg-inkLight transition disabled:opacity-50"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </div>

        <div className="border border-ink/10 p-5 h-fit">
          <p className="font-display text-lg text-ink mb-4">Order summary</p>
          <ul className="space-y-2 mb-4">
            {items.map((i) => (
              <li key={`${i.productId}-${i.size}`} className="flex justify-between text-sm">
                <span className="text-charcoal/70">
                  {i.name} {i.size && `(${i.size})`} × {i.qty}
                </span>
                <span className="text-ink">{formatNaira(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-ink/10 pt-3 font-medium text-ink">
            <span>Total</span>
            <span>{formatNaira(totalAmount)}</span>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink block mb-1">{label}</span>
      {children}
    </label>
  );
}
