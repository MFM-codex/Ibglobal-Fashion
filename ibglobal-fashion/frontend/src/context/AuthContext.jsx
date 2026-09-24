import React, { createContext, useContext, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);
const STORAGE_KEY = "ibglobal_admin_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [adminName, setAdminName] = useState(null);

  async function login(email, password) {
    const data = await api.login(email, password);
    localStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setAdminName(data.user?.name || "Admin");
    return data;
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setAdminName(null);
  }

  return (
    <AuthContext.Provider value={{ token, adminName, isLoggedIn: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
