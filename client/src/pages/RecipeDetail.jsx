import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../util/api";
import styles from "./RecipeDetail.module.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    API.get(`/recipes/${id}`).then(setRecipe).catch(console.error);
  }, [id]);

  if (!recipe) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{recipe.title}</h2>

      <img
        src={recipe.image_url}
        alt=""
        className={styles.image}
      />

      <p className={styles.description}>{recipe.description}</p>

      <h3 className={styles.header}>Ingredients</h3>
      <ul className={styles.list}>
        {recipe.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
      </ul>

      <h3 className={styles.header}>Steps</h3>
      <ol className={styles.list}>
        {recipe.steps.map((s, idx) => <li key={idx}>{s}</li>)}
      </ol>
    </div>
  );
}
