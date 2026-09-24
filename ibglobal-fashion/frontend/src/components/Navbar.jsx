import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../api";

export default function Navbar() {
  const { totalCount } = useCart();
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <header className="bg-ink text-parchment sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <Link to="/" aria-label="IBGLOBAL FASHION home">
          <Logo variant="light" />
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-sans text-sm">
          {categories.map((cat) => (
            <NavLink
              key={cat}
              to={`/category/${encodeURIComponent(cat)}`}
              className={({ isActive }) =>
                `hover:text-brassLight transition ${isActive ? "text-brassLight" : "text-parchment/90"}`
              }
            >
              {cat}
            </NavLink>
          ))}
          <NavLink to="/custom-order" className="hover:text-brassLight transition text-parchment/90">
            Made to measure
          </NavLink>
          <NavLink to="/track-order" className="hover:text-brassLight transition text-parchment/90">
            Track order
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative" aria-label="View cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="9" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21 7H6" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brass text-ink text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-inkLight px-5 py-4 flex flex-col gap-3 font-sans text-sm">
          {categories.map((cat) => (
            <NavLink
              key={cat}
              to={`/category/${encodeURIComponent(cat)}`}
              onClick={() => setMenuOpen(false)}
              className="text-parchment/90"
            >
              {cat}
            </NavLink>
          ))}
          <NavLink to="/custom-order" onClick={() => setMenuOpen(false)} className="text-parchment/90">
            Made to measure
          </NavLink>
          <NavLink to="/track-order" onClick={() => setMenuOpen(false)} className="text-parchment/90">
            Track order
          </NavLink>
        </nav>
      )}

      <div className="tape-rule" />
    </header>
  );
}
