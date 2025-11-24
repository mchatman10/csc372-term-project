import { Link } from 'react-router-dom';
import styles from './RecipeCard.module.css';

export default function RecipeCard({ r }) {
    const cover = r.image_url || '/default-recipe.png';

    return (
        <div className="card">
            <img className={styles.cover} src={cover} alt={r.title} />

            <h3 className={styles.title}>{r.title}</h3>

            <div className={styles.badges}>
                {(r.categories || []).map(c => (
                    <span key={c} className="badge">{c}</span>
                ))}
            </div>

            <div className={styles.footer}>
                <span>⭐ {r.avg_rating || 0}</span>
                <Link className="btn secondary" to={`/recipe/${r.id}`}>
                    View
                </Link>
            </div>
        </div>
    );
}
