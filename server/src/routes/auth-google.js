import { Router } from "express";
import { query } from "../db.js";
import { OAuth2Client } from "google-auth-library";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential)
      return res.status(400).json({ error: "Missing credential" });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let { rows } = await query(
      "SELECT id, email, display_name, avatar FROM users WHERE google_sub=$1",
      [sub]
    );

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

    return res.json(user);
  } catch (err) {
    console.error("Google auth error:", err.message || err);
    return res.status(401).json({ error: "Invalid Google credential" });
  }
});

export default router;
