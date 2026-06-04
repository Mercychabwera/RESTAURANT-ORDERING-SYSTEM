const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export const api = {
  health: () => request("/health/"),
  getMenuItems: () => request("/menu-items/"),
  createMenuItem: (payload) =>
    request("/menu-items/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getOrders: () => request("/orders/"),
  createOrder: (payload) =>
    request("/orders/", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  getBills: () => request("/bills/"),
  updateBill: (id, payload) =>
    request(`/bills/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  getSalesReport: () => request("/sales-report/"),
};

export function formatMwk(value) {
  return new Intl.NumberFormat("en-MW", {
    style: "currency",
    currency: "MWK",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}
