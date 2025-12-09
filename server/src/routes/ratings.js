import { Router } from "express";
import { query } from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: "Login required" });

    const { recipe_id, value } = req.body || {};
    if (!recipe_id || !value || value < 1 || value > 5)
      return res.status(400).json({ error: "Invalid rating" });

    await query(
      `INSERT INTO ratings (user_id, recipe_id, value)
       VALUES ($1,$2,$3)
       ON CONFLICT (user_id, recipe_id)
       DO UPDATE SET value=EXCLUDED.value`,
      [userId, recipe_id, value]
    );

    res.json({ ok: true });
  } catch (e) {
    console.error("ratings POST error:", e?.message || e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/user/:recipeId", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) return res.status(401).json({ error: "Login required" });
  const { recipeId } = req.params;
  const { rows } = await query(
    "SELECT value FROM ratings WHERE user_id=$1 AND recipe_id=$2",
    [userId, recipeId]
  );
  res.json(rows[0] || { value: 0 });
});

router.get("/average/:recipeId", async (req, res) => {
  const { recipeId } = req.params;
  const { rows } = await query(
    "SELECT COALESCE(AVG(value),0)::numeric(3,1) as average FROM ratings WHERE recipe_id=$1",
    [recipeId]
  );
  res.json(rows[0]);
});

export default router;
