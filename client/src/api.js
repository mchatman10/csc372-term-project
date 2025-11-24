const API_BASE = import.meta.env.VITE_API_URL;

async function request(path, method = "GET", body) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Request failed");
  }

  return res.json();
}

export const API = {
  googleLogin: (credential) =>
    request("/auth/google", "POST", { credential }),

  get: (path) => request(path),
  post: (path, body) => request(path, "POST", body),
  del: (path) => request(path, "DELETE"),

  rateRecipe: (recipeId, value) =>
    request("/ratings", "POST", { recipe_id: recipeId, value }),

  getUserRating: (recipeId) =>
    request(`/ratings/user/${recipeId}`),

  getAverageRating: (recipeId) =>
    request(`/ratings/average/${recipeId}`),
};
