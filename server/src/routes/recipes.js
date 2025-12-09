import { Router } from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
    const { rows } = await query(
        "SELECT * FROM recipes ORDER BY created_at DESC"
    );
    res.json(rows);
});

router.get("/:id", async (req, res) => {
    const { rows } = await query("SELECT * FROM recipes WHERE id=$1", [
        req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
});

router.post("/", requireAuth, async (req, res) => {
    const { title, description, ingredients, steps, image_url } = req.body;

    const { rows } = await query(
        `INSERT INTO recipes (user_id, title, description, ingredients, steps, image_url)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id`,
        [
            req.session.userId,
            title,
            description,
            ingredients,
            steps,
            image_url,
        ]
    );

    res.json({ id: rows[0].id });
});

router.put("/:id", requireAuth, async (req, res) => {
    const { title, description, ingredients, steps, image_url } = req.body;

    await query(
        `UPDATE recipes 
     SET title=$1, description=$2, ingredients=$3, steps=$4, image_url=$5
     WHERE id=$6 AND user_id=$7`,
        [
            title,
            description,
            ingredients,
            steps,
            image_url,
            req.params.id,
            req.session.userId,
        ]
    );

    res.json({ ok: true });
});

router.delete("/:id", requireAuth, async (req, res) => {
    await query(
        "DELETE FROM recipes WHERE id=$1 AND user_id=$2",
        [req.params.id, req.session.userId]
    );

    res.json({ ok: true });
});

export default router;
