import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/measurements", label: "Custom requests" },
];

export default function AdminLayout({ children }) {
  const { logout, adminName } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-parchment">
      <aside className="md:w-56 bg-ink text-parchment md:min-h-screen">
        <div className="px-5 py-5">
          <div className="font-display text-lg text-parchment">IBGLOBAL</div>
          <div className="text-[11px] uppercase tracking-wide2 text-brass">Admin panel</div>
        </div>
        <nav className="flex md:flex-col gap-1 px-3 pb-4 overflow-x-auto md:overflow-visible">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3 py-2 text-sm rounded whitespace-nowrap ${
                  isActive ? "bg-inkLight text-brassLight" : "text-parchment/80 hover:bg-inkLight/60"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-5 py-4 border-t border-parchment/10 hidden md:block">
          <div className="text-xs text-parchment/60 mb-2">Signed in as {adminName || "Admin"}</div>
          <button onClick={handleLogout} className="text-sm text-brassLight hover:underline">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
