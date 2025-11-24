import { Router } from "express";
import { query } from "../db.js";
import jwt from "jsonwebtoken";

const router = Router();

let googleKeys = null;

async function getGoogleKeys() {
  if (!googleKeys) {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/certs");
    googleKeys = await res.json();
  }
  return googleKeys;
}

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ error: "Missing credential" });

    const keys = await getGoogleKeys();
    const payload = jwt.verify(credential, keys, { algorithms: ["RS256"] });

    const { sub, email, name, picture } = payload;

    let { rows } = await query("SELECT id, email, display_name, avatar FROM users WHERE google_sub=$1", [sub]);

    if (!rows[0]) {
      ({ rows } = await query(
        `INSERT INTO users (google_sub, email, display_name, avatar)
         VALUES ($1,$2,$3,$4)
         RETURNING id, email, display_name, avatar`,
        [sub, email, name, picture]
      ));
    }

    const user = rows[0];

    req.session.userId = user.id;
    req.session.email = user.email;

    res.json(user);
  } catch (err) {
    console.error("Google auth error:", err?.message || err);
    res.status(401).json({ error: "Invalid Google credential" });
  }
});

export default router;
