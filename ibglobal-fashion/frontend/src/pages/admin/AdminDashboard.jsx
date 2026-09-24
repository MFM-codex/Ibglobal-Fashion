import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../api";

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getDashboard(token).then(setStats).catch(() => {});
  }, [token]);

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl text-ink mb-6">Dashboard</h1>

      {!stats ? (
        <p className="text-charcoal/60 text-sm">Loading…</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total orders" value={stats.totalOrders} />
            <StatCard label="Revenue" value={formatNaira(stats.totalRevenue)} />
            <StatCard label="Pending orders" value={stats.pendingOrders} />
            <StatCard label="New custom requests" value={stats.pendingMeasurements} />
          </div>

          {stats.lowStockProducts > 0 && (
            <div className="border border-wine/40 bg-wine/5 px-4 py-3 mb-8 text-sm text-ink">
              {stats.lowStockProducts} product{stats.lowStockProducts !== 1 ? "s have" : " has"} a size
              running low on stock (2 or fewer left).{" "}
              <Link to="/admin/products" className="underline">
                Review products
              </Link>
            </div>
          )}

          <h2 className="font-display text-xl text-ink mb-4">Recent orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-charcoal/60 text-sm">No orders yet.</p>
          ) : (
            <div className="border border-ink/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-parchmentDark text-charcoal/60">
                    <th className="px-4 py-2 font-medium">Tracking code</th>
                    <th className="px-4 py-2 font-medium">Customer</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o) => (
                    <tr key={o.id} className="border-t border-ink/10">
                      <td className="px-4 py-2 font-mono text-xs">{o.trackingCode}</td>
                      <td className="px-4 py-2">{o.customer.name}</td>
                      <td className="px-4 py-2 capitalize">{o.status}</td>
                      <td className="px-4 py-2">{formatNaira(o.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border border-ink/10 bg-white/40 px-4 py-4">
      <p className="text-xs text-charcoal/50 mb-1">{label}</p>
      <p className="font-display text-2xl text-ink">{value}</p>
    </div>
  );
}
