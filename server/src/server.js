import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

import authGoogle from "./routes/auth-google.js";
import recipes from "./routes/recipes.js";
import ratings from "./routes/ratings.js";
import external from "./routes/external.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = new Set(
  [process.env.CLIENT_ORIGIN, "http://localhost:5173"].filter(Boolean)
);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    },
  })
);

app.use(express.json());
app.use("/auth", authGoogle);
app.use("/recipes", recipes);
app.use("/ratings", ratings);
app.use("/external", external);

app.get("/health", (req, res) => res.json({ status: "OK" }));

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
