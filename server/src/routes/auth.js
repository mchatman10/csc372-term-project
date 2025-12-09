import { Router } from "express";
import { query } from "../db.js";
import bcrypt from "bcrypt";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password, display_name } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const hash = await bcrypt.hash(password, 10);

  try {
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, display_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, display_name`,
      [email, hash, display_name || null]
    );

    req.session.userId = rows[0].id;
    res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505")
      return res.status(400).json({ error: "Email already in use" });
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { rows } = await query(
    `SELECT id, email, password_hash, display_name
     FROM users WHERE email=$1`,
    [email]
  );

  if (!rows.length)
    return res.status(400).json({ error: "Invalid email or password" });

  const user = rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid)
    return res.status(400).json({ error: "Invalid email or password" });

  req.session.userId = user.id;
  res.json({
    id: user.id,
    email: user.email,
    display_name: user.display_name
  });
});

router.get("/me", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ user: null });

  const { rows } = await query(
    `SELECT id, email, display_name
     FROM users WHERE id=$1`,
    [req.session.userId]
  );

  res.json(rows[0] || null);
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

export default router;
