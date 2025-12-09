export function buildNutritionQuery(ingredients = []) {
  const list = (ingredients || []).map(s => String(s || "").trim()).filter(Boolean);
  return list.join(", ");
}
