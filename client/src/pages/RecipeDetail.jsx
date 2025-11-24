import { useEffect, useState } from 'react';
import { API } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import styles from './RecipeDetail.module.css';

export default function RecipeDetail() {
    const { id } = useParams();
    const nav = useNavigate();
    const { user } = useAuth();
    const [r, setR] = useState(null);
    const [myScore, setMyScore] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => { API.get(`/recipes/${id}`).then(setR); }, [id]);

    async function loadRatings() {
        const user = await API.getUserRating(id);
        const avg = await API.getAverageRating(id);

        setUserRating(user?.value || 0);
        setAverageRating(avg?.average || 0);
    }

    useEffect(() => { loadRatings(); }, [id]);

    async function rate(value) {
        if (!user) return alert('Login to rate');

        await API.rateRecipe(id, value);
        setMyScore(value);

        const updated = await API.get(`/recipes/${id}`);
        setR(updated);
    }

    async function remove() {
        if (!user) return alert('Login required');
        await API.delete(`/recipes/${id}`);
        nav('/');
    }

    if (!r) return null;

    const cover = r.image_url || '/default-recipe.png';

    return (
        <div className={styles.wrapper}>
            <div className="card">
                <img className={styles.cover} src={cover} alt={r.title} />
                <h1>{r.title}</h1>
                <p>{r.description}</p>

                <div className={styles.badges}>
                    {(r.categories || []).map(c => (
                        <span key={c} className="badge">{c}</span>
                    ))}
                </div>

                <h3>Ingredients</h3>
                <ul>{r.ingredients.map((x, i) => <li key={i}>{x}</li>)}</ul>

                <h3>Steps</h3>
                <ol>{r.steps.map((x, i) => <li key={i}>{x}</li>)}</ol>

                <div className={styles.ratingRow}>
                    <div className={styles.avgBox}>
                        <span>Average: {averageRating}</span>
                        <StarRating value={userRating} onRate={rate} />
                    </div>

                    <button className="btn" onClick={remove}>Delete</button>
                </div>
            </div>
        </div>
    );
}
