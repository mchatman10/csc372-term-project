// server/src/routes/external.js
import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

router.get("/random", async (_req, res) => {
  try {
    const r = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await r.json();
    res.json(data.meals[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch external recipe." });
  }
});

router.get("/category/:name", async (req, res) => {
  try {
    const r = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${req.params.name}`
    );
    const data = await r.json();
    res.json(data.meals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch category." });
  }
});

export default router;
