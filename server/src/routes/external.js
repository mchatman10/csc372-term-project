import { Router } from "express";
import { buildNutritionQuery } from "../util/parse-nutrition.js";

const router = Router();

router.post("/nutrition", async (req, res) => {
  try {
    const { ingr = [] } = req.body || {};
    const q = buildNutritionQuery(ingr);
    if (!q) return res.status(400).json({ error: "No ingredients" });

    const url = `${process.env.CALORIENINJAS_URL || "https://api.calorieninjas.com/v1/nutrition"}?query=${encodeURIComponent(q)}`;

    const resp = await fetch(url, {
      headers: { "X-Api-Key": process.env.CALORIENINJAS_API_KEY || "" },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ error: "Nutrition API error", details: text });
    }

    const data = await resp.json();
    const calories = (data.items || []).reduce((a, x) => a + (x.calories || 0), 0);
    res.json({ calories, raw: data });
  } catch (e) {
    console.error("external/nutrition error:", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
