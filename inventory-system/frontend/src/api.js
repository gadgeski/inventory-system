const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function http(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const api = {
  // Products
  listProducts: () => http("/products"),
  createProduct: (payload) =>
    http("/products", { method: "POST", body: JSON.stringify(payload) }),
  getProduct: (id) => http(`/products/${id}`),
  updateProduct: (id, payload) =>
    http(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProduct: (id) => http(`/products/${id}`, { method: "DELETE" }),

  // Transactions
  listTransactions: (productId) => {
    const q = productId ? `?product_id=${productId}` : "";
    return http(`/transactions${q}`);
  },
  createTransaction: (payload) =>
    http("/transactions", { method: "POST", body: JSON.stringify(payload) }),

  // Reorder
  listReorder: () => http("/reorder"),
};
