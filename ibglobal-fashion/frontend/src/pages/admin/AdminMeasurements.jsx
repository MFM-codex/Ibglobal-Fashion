import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../api";

const STATUSES = ["new", "reviewed", "in progress", "completed"];

export default function AdminMeasurements() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);

  function load() {
    api.getMeasurements(token).then(setRequests).catch(() => {});
  }

  useEffect(load, [token]);

  async function handleStatusChange(id, status) {
    await api.updateMeasurementStatus(id, status, token);
    load();
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl text-ink mb-6">Custom measurement requests</h1>

      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="border border-ink/10 bg-white/40 px-4 py-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div>
                <p className="text-sm font-medium text-ink">{r.name}</p>
                <p className="text-xs text-charcoal/60">
                  {r.phone} {r.email && `· ${r.email}`}
                </p>
              </div>
              <select
                value={r.status}
                onChange={(e) => handleStatusChange(r.id, e.target.value)}
                className="border border-ink/20 px-2 py-1 text-xs capitalize bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {Object.keys(r.measurements || {}).length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3 text-xs">
                {Object.entries(r.measurements).map(([key, value]) =>
                  value ? (
                    <div key={key} className="border border-ink/10 px-2 py-1">
                      <div className="text-charcoal/50 capitalize">{key}</div>
                      <div className="text-ink">{value}"</div>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {r.notes && <p className="text-sm text-charcoal/70">{r.notes}</p>}
          </div>
        ))}
        {requests.length === 0 && <p className="text-charcoal/60 text-sm">No custom requests yet.</p>}
      </div>
    </AdminLayout>
  );
}
