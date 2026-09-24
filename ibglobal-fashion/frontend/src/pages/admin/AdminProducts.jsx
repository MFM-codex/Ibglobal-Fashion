import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../api";

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  function load() {
    api.getProducts().then(setProducts).catch(() => {});
  }

  useEffect(load, []);

  async function handleDelete(id, name) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    try {
      await api.deleteProduct(id, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Products</h1>
        <Link to="/admin/products/new" className="bg-ink text-parchment px-4 py-2 text-sm hover:bg-inkLight transition">
          Add product
        </Link>
      </div>

      {error && <p className="text-wine text-sm mb-4">{error}</p>}

      <div className="border border-ink/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-parchmentDark text-charcoal/60">
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Price</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-ink/10">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">{formatNaira(p.price)}</td>
                <td className="px-4 py-2">
                  {p.inStock ? (
                    <span className="text-xs text-ink bg-brass/15 px-2 py-1">In stock</span>
                  ) : (
                    <span className="text-xs text-wine bg-wine/10 px-2 py-1">Out of stock</span>
                  )}
                  {p.madeToOrder && (
                    <span className="text-xs text-charcoal/60 ml-2">Made to order</span>
                  )}
                </td>
                <td className="px-4 py-2 text-right space-x-3">
                  <Link to={`/admin/products/${p.id}`} className="text-brass hover:underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(p.id, p.name)} className="text-wine hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-charcoal/60 text-sm px-4 py-6">No products yet. Add your first one.</p>
        )}
      </div>
    </AdminLayout>
  );
}
