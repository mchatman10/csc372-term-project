import { Router } from "express";
import { parseNutrition } from "../util/parse-nutrition.js";

const router = Router();
router.post("/nutrition", async (req, res) => {
    try {
        const { ingr = [] } = req.body;

        const query = Array.isArray(ingr)
            ? ingr.filter(Boolean).join(", ")
            : String(ingr);

        const url = `${process.env.CALORIENINJAS_URL}?query=${encodeURIComponent(
            query
        )}`;

        const response = await fetch(url, {
            headers: { "X-Api-Key": process.env.CALORIENINJAS_API_KEY },
        });

        if (!response.ok) {
            throw new Error("CalorieNinjas request failed");
        }

        const raw = await response.json();

        const parsed = parseNutrition(raw);

        res.json(parsed);
    } catch (err) {
        console.error("Nutrition API error:", err);
        res.status(500).json({ error: "Unable to fetch nutrition info" });
    }
});

export default router;
