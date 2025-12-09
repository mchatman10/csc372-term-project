import 'dotenv/config';
import fetch from "node-fetch";
import { query } from "../db.js";

async function importCategory(name) {
    console.log("Importing category:", name);

    const r = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${name}`
    );
    const data = await r.json();
    const meals = data.meals || [];

    for (const m of meals) {
        try {
            const full = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`
            );
            const detailed = (await full.json()).meals[0];

            const ingredients = Object.keys(detailed)
                .filter(k => k.startsWith("strIngredient") && detailed[k])
                .map(k => detailed[k]);

            const steps = detailed.strInstructions
                ? detailed.strInstructions.split("\n").filter(Boolean)
                : [];

            await query(
                `INSERT INTO recipes (title, description, ingredients, steps, image_url)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT DO NOTHING`,
                [
                    detailed.strMeal,
                    detailed.strInstructions?.slice(0, 200) || "A recipe from TheMealDB.",
                    ingredients,
                    steps,
                    detailed.strMealThumb
                ]
            );

            console.log("Added:", detailed.strMeal);
        } catch (err) {
            console.error("Error importing", m.idMeal, err);
        }
    }
}

async function main() {
    await importCategory("Breakfast");
    await importCategory("Lunch");
    await importCategory("Dinner");

    console.log("Import complete.");
    process.exit();
}

main();
