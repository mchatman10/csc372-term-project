import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

import recipeRoutes from "./routes/recipes.js";
import externalRoutes from "./routes/external.js";
import googleAuth from "./routes/auth-google.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/recipes", recipeRoutes);
app.use("/external", externalRoutes);
app.use("/auth", googleAuth);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
