let API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  console.warn("VITE_API_URL is missing — falling back to localhost");
  API_BASE = "http://localhost:5000";
}

async function request(path, method = "GET", body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);

  if (!res.ok) {
    const text = await res.text().catch(() => "Request failed");
    throw new Error(text);
  }

  return res.json();
}

export const API = {
  login: (email, password) =>
    request("/auth/login", "POST", { email, password }),

  register: (email, password, display_name) =>
    request("/auth/register", "POST", {
      email,
      password,
      display_name
    }),

  logout: () => request("/auth/logout", "POST"),

  listRecipes: () => request("/recipes"),
  getRecipe: (id) => request(`/recipes/${id}`),
  createRecipe: (data) => request("/recipes", "POST", data),

  del: (p) => request(p, "DELETE"),
  get: (p) => request(p),
  post: (p, b) => request(p, "POST", b)
};
