import { useEffect, useState } from "react";
import { API } from "../util/api";
import RecipeCard from "../components/RecipeCard";
import styles from "./RecipeList.module.css";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    API.get("/recipes").then(setRecipes).catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Recipes</h2>

      <div className={styles.grid}>
        {recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} />
        ))}
      </div>
    </div>
  );
}
