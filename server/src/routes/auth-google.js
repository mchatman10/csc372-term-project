import { Router } from "express";
import { query } from "../db.js";
import { OAuth2Client } from "google-auth-library";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ error: "Missing credential" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ error: "Invalid credential" });

    const { sub: googleSub, email, name, picture } = payload;
    if (!googleSub || !email) return res.status(401).json({ error: "Invalid Google token" });

    let { rows } = await query(
      "SELECT id, email, display_name, avatar FROM users WHERE google_sub=$1",
      [googleSub]
    );

    if (!rows[0]) {
      ({ rows } = await query(
        `INSERT INTO users (google_sub, email, display_name, avatar)
         VALUES ($1,$2,$3,$4)
         RETURNING id, email, display_name, avatar`,
        [googleSub, email, name, picture]
      ));
    }

    const user = rows[0];
    req.session.userId = user.id;
    req.session.email = user.email;

    return res.json(user);
  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err?.message || err);
    return res.status(401).json({ error: "Invalid Google credential", details: err?.message });
  }
});

router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) return res.status(401).json({ user: null });
    const { rows } = await query(
      "SELECT id, email, display_name, avatar FROM users WHERE id=$1",
      [req.session.userId]
    );
    if (!rows[0]) return res.status(404).json({ user: null });
    return res.json(rows[0]);
  } catch (e) {
    console.error("Auth /me error:", e?.message || e);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

export default router;
