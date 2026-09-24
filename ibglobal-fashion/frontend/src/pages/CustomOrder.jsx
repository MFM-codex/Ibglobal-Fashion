import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";

const MEASUREMENT_FIELDS = [
  { key: "chest", label: "Chest (in)" },
  { key: "waist", label: "Waist (in)" },
  { key: "hip", label: "Hip (in)" },
  { key: "shoulder", label: "Shoulder (in)" },
  { key: "sleeve", label: "Sleeve length (in)" },
  { key: "length", label: "Garment length (in)" },
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  notes: "",
};

export default function CustomOrder() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId") || "";

  const [form, setForm] = useState(initialForm);
  const [measurements, setMeasurements] = useState({});
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      await api.submitMeasurements({
        ...form,
        productId: productId || null,
        measurements,
      });
      setStatus("success");
      setForm(initialForm);
      setMeasurements({});
    } catch (err) {
      setStatus(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <h1 className="font-display text-3xl text-ink mb-4">Request received</h1>
        <p className="text-charcoal/70">
          Thanks — the shop will review your measurements and reach out by phone or WhatsApp to
          confirm fabric, fit, and price before cutting begins.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-ink mb-2">Made to measure</h1>
      <p className="text-charcoal/60 mb-8">
        Send your measurements and we'll confirm fit, fabric, and price before we start cutting.
        {productId && " We've noted the piece you were browsing."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
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
            />
          </Field>
        </div>
        <Field label="Email (optional)">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-ink/20 px-3 py-2 text-sm"
          />
        </Field>

        <div>
          <p className="text-sm font-medium text-ink mb-3">Your measurements</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {MEASUREMENT_FIELDS.map((f) => (
              <Field key={f.key} label={f.label}>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={measurements[f.key] || ""}
                  onChange={(e) => setMeasurements({ ...measurements, [f.key]: e.target.value })}
                  className="w-full border border-ink/20 px-3 py-2 text-sm"
                />
              </Field>
            ))}
          </div>
          <p className="text-xs text-charcoal/50 mt-2">
            Not sure how to measure? Mention that in the notes below and we'll guide you by phone.
          </p>
        </div>

        <Field label="Notes (fabric preference, style, occasion, etc.)">
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full border border-ink/20 px-3 py-2 text-sm"
            rows={4}
          />
        </Field>

        {status && status !== "success" && <p className="text-wine text-sm">{status}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-parchment py-3 text-sm font-medium hover:bg-inkLight transition disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Send my measurements"}
        </button>
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
