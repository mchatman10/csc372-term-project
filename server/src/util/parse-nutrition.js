export function parseNutrition(data) {
  if (!data || !data.items || data.items.length === 0) {
    return {
      totalCalories: 0,
      items: [],
    };
  }

  const items = data.items.map((item) => ({
    name: item.name,
    calories: item.calories,
    protein: item.protein_g,
    carbs: item.carbohydrates_total_g,
    fat: item.fat_total_g,
    servingSize: item.serving_size_g,
  }));

  const totalCalories = items.reduce((sum, i) => sum + i.calories, 0);

  return {
    totalCalories,
    items,
  };
}
