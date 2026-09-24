// Thin wrapper around fetch. In dev, Vite proxies /api to the backend (see
// vite.config.js); in production, set VITE_API_URL to your deployed API.

const BASE_URL = import.meta.env.VITE_API_URL || "";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message = data?.error || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}

export const api = {
  // Shop
  getShopInfo: () => request("/api/shop-info"),

  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/products${qs ? `?${qs}` : ""}`);
  },
  getCategories: () => request("/api/products/categories"),
  getProduct: (id) => request(`/api/products/${id}`),
  addReview: (id, review) => request(`/api/products/${id}/reviews`, { method: "POST", body: review }),
  createProduct: (product, token) => request("/api/products", { method: "POST", body: product, token }),
  updateProduct: (id, product, token) =>
    request(`/api/products/${id}`, { method: "PUT", body: product, token }),
  deleteProduct: (id, token) => request(`/api/products/${id}`, { method: "DELETE", token }),

  // Orders
  createOrder: (order) => request("/api/orders", { method: "POST", body: order }),
  trackOrder: (code) => request(`/api/orders/track/${code}`),
  getOrders: (token, status) =>
    request(`/api/orders${status ? `?status=${status}` : ""}`, { token }),
  updateOrderStatus: (id, status, token) =>
    request(`/api/orders/${id}/status`, { method: "PUT", body: { status }, token }),

  // Measurements / custom orders
  submitMeasurements: (payload) => request("/api/measurements", { method: "POST", body: payload }),
  getMeasurements: (token) => request("/api/measurements", { token }),
  updateMeasurementStatus: (id, status, token) =>
    request(`/api/measurements/${id}/status`, { method: "PUT", body: { status }, token }),

  // Admin
  getDashboard: (token) => request("/api/admin/dashboard", { token }),
  login: (email, password) => request("/api/auth/login", { method: "POST", body: { email, password } }),

  // Upload
  uploadImage: async (file, token) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Image upload failed.");
    return data;
  },
};
