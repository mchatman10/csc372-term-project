import React, { useEffect, useState } from "react";
import { API } from "../api.js";
import RecipeCard from "../components/RecipeCard.jsx";
import styles from "../styles/Layout.module.css";

export default function Home() {
  const [items, setItems] = useState([]);
  useEffect(() => { API.get("/recipes").then(setItems); }, []);
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {items.map(r => <RecipeCard key={r.id} r={r} />)}
      </div>
    </div>
  );
}
