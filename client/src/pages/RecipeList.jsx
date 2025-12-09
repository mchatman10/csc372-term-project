import { useEffect, useState } from 'react';
import { API } from '../util/api';
import RecipeCard from '../components/RecipeCard';
import styles from './RecipeList.module.css';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await API.listRecipes();
        setRecipes(data || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!recipes.length) return <p>No recipes found.</p>;

  return (
    <div className={styles.grid}>
      {recipes.map((r) =>
        r ? <RecipeCard key={r.id} r={r} /> : null
      )}
    </div>
  );
}
