const API_BASE = import.meta.env.VITE_API_URL
async function request(path, method = 'GET', body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include' }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${API_BASE}${path}`, opts)
  if (!res.ok) { const txt = await res.text().catch(() => 'Request failed'); throw new Error(txt || 'Request failed') }
  return res.json()
}
export const API = {
  get: (p) => request(p), post: (p, b) => request(p, 'POST', b), del: (p) => request(p, 'DELETE'),
  me: () => request('/auth/me'),
  login: (email, password) => request('/auth/login', 'POST', { email, password }),
  register: (email, password, display_name) => request('/auth/register', 'POST', { email, password, display_name }),
  logout: () => request('/auth/logout', 'POST'),
  listRecipes: () => request('/recipes'), getRecipe: (id) => request(`/recipes/${id}`), createRecipe: (data) => request('/recipes', 'POST', data)
}
