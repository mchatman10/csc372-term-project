import { Router } from "express";
import { query } from "../db.js";
import { parseNutrition } from "../util/parse-nutrition.js";

const router = Router();


router.get("/", async (req, res) => {
  try {
    const sql = `
      SELECT r.*,
        (
          SELECT ROUND(AVG(value), 2)
          FROM ratings
          WHERE recipe_id = r.id
        ) AS average_rating
      FROM recipes r
      ORDER BY r.id DESC;
    `;

    const { rows } = await query(sql);
    res.json(rows);
  } catch (err) {
    console.error("GET /recipes error:", err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;

    const { rows } = await query("SELECT * FROM recipes WHERE id=$1", [
      recipeId,
    ]);

    if (!rows[0]) return res.status(404).json({ error: "Recipe not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error("GET /recipes/:id error:", err);
    res.status(500).json({ error: "Failed to fetch recipe" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, ingredients, steps, image_url } = req.body;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const sql = `
      INSERT INTO recipes (user_id, title, description, ingredients, steps, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const { rows } = await query(sql, [
      userId,
      title,
      description,
      ingredients,
      steps,
      image_url || null,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error("POST /recipes error:", err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { title, description, ingredients, steps, image_url } = req.body;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const sql = `
      UPDATE recipes 
      SET title=$1, description=$2, ingredients=$3, steps=$4, image_url=$5
      WHERE id=$6
      RETURNING *;
    `;

    const { rows } = await query(sql, [
      title,
      description,
      ingredients,
      steps,
      image_url || null,
      recipeId,
    ]);

    res.json(rows[0]);
  } catch (err) {
    console.error("PUT /recipes error:", err);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.session.userId;

    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    await query("DELETE FROM recipes WHERE id=$1", [recipeId]);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /recipes/:id error:", err);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
});

router.post("/:id/rate", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.session.userId;
    const { value } = req.body;

    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    if (!value || value < 1 || value > 5)
      return res.status(400).json({ error: "Rating must be 1–5" });

    const sql = `
      INSERT INTO ratings (user_id, recipe_id, value)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, recipe_id)
      DO UPDATE SET value = EXCLUDED.value
      RETURNING *;
    `;

    const { rows } = await query(sql, [userId, recipeId, value]);
    res.json(rows[0]);
  } catch (err) {
    console.error("POST /rate error:", err);
    res.status(500).json({ error: "Failed to rate recipe" });
  }
});

router.get("/:id/rating", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.session.userId;

    const { rows } = await query(
      "SELECT value FROM ratings WHERE user_id=$1 AND recipe_id=$2",
      [userId, recipeId]
    );

    res.json(rows[0] || { value: null });
  } catch (err) {
    console.error("GET /rating error:", err);
    res.status(500).json({ error: "Failed to get user rating" });
  }
});

router.get("/:id/average-rating", async (req, res) => {
  try {
    const recipeId = req.params.id;

    const { rows } = await query(
      "SELECT ROUND(AVG(value), 2) AS average FROM ratings WHERE recipe_id=$1",
      [recipeId]
    );

    res.json({ average: rows[0].average || 0 });
  } catch (err) {
    console.error("GET /average-rating error:", err);
    res.status(500).json({ error: "Failed to get average rating" });
  }
});

router.delete("/:id/rate", async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.session.userId;

    await query(
      "DELETE FROM ratings WHERE user_id=$1 AND recipe_id=$2",
      [userId, recipeId]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /rate error:", err);
    res.status(500).json({ error: "Failed to delete rating" });
  }
});

export default router;
