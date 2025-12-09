import { Router } from "express";
import { query } from "../db.js";

const router = Router();

router.get("/", async (_req, res) => {
  const { rows } = await query(
    `SELECT r.*, COALESCE(AVG(rt.value), 0)::numeric(3,1) AS avg_rating
     FROM recipes r
     LEFT JOIN ratings rt ON rt.recipe_id = r.id
     GROUP BY r.id
     ORDER BY r.created_at DESC`
  );
  res.json(rows.map(r => ({
    ...r,
    ingredients: r.ingredients || [],
    steps: r.steps || []
  })));
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { rows } = await query(
    `SELECT r.*, COALESCE(
        (SELECT json_agg(json_build_object('value', value, 'user_id', user_id))
         FROM ratings WHERE recipe_id = r.id), '[]'::json) AS ratings
     FROM recipes r
     WHERE r.id = $1`,
    [id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Not found" });
  const r = rows[0];
  res.json({ ...r, ingredients: r.ingredients || [], steps: r.steps || [] });
});

router.post("/", async (req, res) => {
  const { title, description, ingredients = [], steps = [], image_url = "" } = req.body || {};
  if (!title) return res.status(400).json({ error: "Title required" });
  const { rows } = await query(
    `INSERT INTO recipes (title, description, ingredients, steps, image_url)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [title, description || "", ingredients, steps, image_url]
  );
  res.status(201).json(rows[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await query("DELETE FROM ratings WHERE recipe_id=$1", [id]);
  const { rowCount } = await query("DELETE FROM recipes WHERE id=$1", [id]);
  if (!rowCount) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
