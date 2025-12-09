const API_BASE = import.meta.env.VITE_API_URL
async function request(path, method = 'GET', body) {
    const opts = { method, headers: { 'Content-Type': 'application/json' }, credentials: 'include' }
    if (body) opts.body = JSON.stringify(body)
    const res = await fetch(`${API_BASE}${path}`, opts)
    if (!res.ok) { const t = await res.text().catch(() => 'Request failed'); throw new Error(t || 'Request failed') }
    return res.json()
}
export const API = {
    me: () => request('/auth/me'),
    login: (e, p) => request('/auth/login', 'POST', { email: e, password: p }),
    register: (e, p, d) => request('/auth/register', 'POST', { email: e, password: p, display_name: d }),
    logout: () => request('/auth/logout', 'POST'),
    listRecipes: (c) => request(`/recipes${c ? `?category=${encodeURIComponent(c)}` : ''}`),
    getRecipe: (id) => request(`/recipes/${id}`),
    createRecipe: (data) => request('/recipes', 'POST', data),
    updateRecipe: (id, data) => request(`/recipes/${id}`, 'PUT', data),
    deleteRecipe: (id) => request(`/recipes/${id}`, 'DELETE'),
    listCategories: () => request('/categories')
}