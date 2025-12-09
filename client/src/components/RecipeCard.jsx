import { Link } from 'react-router-dom';
import styles from './RecipeCard.module.css';

<p className={styles.categoryTag}>{r.category || "Uncategorized"}</p>

export default function RecipeCard({ r }) {
  if (!r) return null;

  const cover =
    r.image_url ||
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className={`card ${styles.card}`}>
      <img className={styles.cover} src={cover} alt={r.title} />
      <div className={styles.body}>
        <h3>{r.title}</h3>
        <p className={styles.desc}>{r.description}</p>
        <Link className="btn secondary" to={`/recipe/${r.id}`}>
          View
        </Link>
      </div>
    </div>
  );
}
