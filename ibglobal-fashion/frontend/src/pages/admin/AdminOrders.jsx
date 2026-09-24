import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../api";

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

const STATUSES = ["new", "in progress", "ready", "delivered", "cancelled"];

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState(null);

  function load() {
    api.getOrders(token, filter || undefined).then(setOrders).catch(() => {});
  }

  useEffect(load, [token, filter]);

  async function handleStatusChange(id, status) {
    await api.updateOrderStatus(id, status, token);
    load();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl text-ink">Orders</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-ink/20 px-3 py-2 text-sm bg-white"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="border border-ink/10 bg-white/40">
            <button
              onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="font-mono text-xs text-charcoal/60">{o.trackingCode}</p>
                <p className="text-sm text-ink font-medium">{o.customer.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-ink">{formatNaira(o.totalAmount)}</span>
                <select
                  value={o.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="border border-ink/20 px-2 py-1 text-xs capitalize bg-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </button>

            {expanded === o.id && (
              <div className="px-4 pb-4 text-sm border-t border-ink/10 pt-3">
                <p className="text-charcoal/60 mb-1">
                  Phone: <span className="text-ink">{o.customer.phone}</span>
                </p>
                {o.customer.email && (
                  <p className="text-charcoal/60 mb-1">
                    Email: <span className="text-ink">{o.customer.email}</span>
                  </p>
                )}
                <p className="text-charcoal/60 mb-1 capitalize">
                  {o.deliveryMethod}
                  {o.customer.address && `: ${o.customer.address}`}
                </p>
                <p className="text-charcoal/60 mb-3 capitalize">Payment: {o.paymentMethod}</p>
                <ul className="space-y-1">
                  {o.items.map((item, i) => (
                    <li key={i} className="flex justify-between text-charcoal/80">
                      <span>
                        {item.name} {item.size && `(${item.size})`} × {item.qty}
                      </span>
                      <span>{formatNaira(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-charcoal/60 text-sm">No orders match this filter.</p>}
      </div>
    </AdminLayout>
  );
}
