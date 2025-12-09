const API_BASE = import.meta.env.VITE_API_URL
async function request(path, method='GET', body){
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  })
  if(!res.ok){
    const text = await res.text().catch(()=> '')
    throw new Error(text || 'Request failed')
  }
  return res.headers.get('content-type')?.includes('application/json') ? res.json() : res.text()
}
export const API = {
  get: p=>request(p), post:(p,b)=>request(p,'POST',b), put:(p,b)=>request(p,'PUT',b), del:p=>request(p,'DELETE'),
  listRecipes: ()=>request('/recipes'),
  getRecipe: id=>request(`/recipes/${id}`),
  createRecipe: payload=>request('/recipes','POST',payload),
  deleteRecipe: id=>request(`/recipes/${id}`,'DELETE'),
  me: ()=>request('/auth/me'), logout: ()=>request('/auth/logout'),
  googleLogin: credential=>request('/auth/google','POST',{credential}),
  nutrition: q=>request(`/external/nutrition?q=${encodeURIComponent(q)}`)
}
