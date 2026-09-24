import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";

export default function Footer() {
  return (
    <footer className="bg-ink text-parchment mt-20">
      <div className="tape-rule" />
      <div className="max-w-6xl mx-auto px-5 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <Logo variant="light" />
          <p className="mt-3 text-sm text-parchment/70 max-w-xs">
            Ready-to-wear and made-to-measure garments, cut and finished by hand.
          </p>
        </div>
        <div className="text-sm">
          <h4 className="font-display text-base mb-3">Shop</h4>
          <ul className="space-y-2 text-parchment/80">
            <li><Link to="/custom-order" className="hover:text-brassLight">Made to measure</Link></li>
            <li><Link to="/track-order" className="hover:text-brassLight">Track an order</Link></li>
            <li><Link to="/cart" className="hover:text-brassLight">Your cart</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <h4 className="font-display text-base mb-3">Admin</h4>
          <ul className="space-y-2 text-parchment/80">
            <li><Link to="/admin/login" className="hover:text-brassLight">Admin sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 pb-6 text-xs text-parchment/50">
        © {new Date().getFullYear()} IBGLOBAL FASHION. All rights reserved.
      </div>
    </footer>
  );
}
