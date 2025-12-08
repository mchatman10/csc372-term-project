import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authGoogle from "./routes/auth-google.js";
import recipes from "./routes/recipes.js";
import external from "./routes/external.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: [
      "https://csc372-term-project-1-lnk9.onrender.com",  // <-- YOUR ACTUAL FRONTEND
      "https://csc372-term-project-1.onrender.com"        // keep if needed
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.options("*", cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: "none",
    },
  })
);

app.use(express.json());

app.use("/auth", authGoogle);
app.use("/recipes", recipes);
app.use("/external", external);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log("API listening on", PORT);
});
