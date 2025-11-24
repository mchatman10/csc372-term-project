const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, { method = 'GET', body, headers } = {}) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...(headers || {}) },
    credentials: 'include'
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

export const API = {
  get: (path) =>
    fetch(import.meta.env.VITE_API_URL + path, {
      credentials: "include",
    }).then((r) => r.json()),

  post: (path, body) =>
    fetch(import.meta.env.VITE_API_URL + path, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  delete: (path) =>
    fetch(import.meta.env.VITE_API_URL + path, {
      method: "DELETE",
      credentials: "include",
    }).then((r) => r.json()),

  getUserRating: (id) => API.get(`/recipes/${id}/rating`),
  getAverageRating: (id) => API.get(`/recipes/${id}/average-rating`),
  rateRecipe: (id, value) => API.post(`/recipes/${id}/rate`, { value }),
  deleteRating: (id) => API.delete(`/recipes/${id}/rate`),
};


