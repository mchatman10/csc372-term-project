import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";

const client = jwksClient({
  jwksUri: "https://www.googleapis.com/oauth2/v3/certs"
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

router.post("/google", (req, res) => {
  const { credential } = req.body;

  jwt.verify(
    credential,
    getKey,
    { algorithms: ["RS256"] },
    async (err, payload) => {
      if (err) {
        console.error("JWT verify error:", err);
        return res.status(401).json({ error: "Invalid Google credential" });
      }

      const { sub, email, name, picture } = payload;

      res.json({ sub, email, name, picture });
    }
  );
});
