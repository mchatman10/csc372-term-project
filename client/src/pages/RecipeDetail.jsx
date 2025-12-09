import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API } from '../util/api.js'
import styles from './RecipeDetail.module.css';

<Link className="btn secondary" to={`/recipe/${id}/edit`}>
    Edit
</Link>

export default function RecipeDetail() {

    const { id } = useParams()
    const [data, setData] = useState(null)
    useEffect(() => { (async () => setData(await API.get(`/recipes/${id}`)))() }, [id])
    if (!data) return null
    return (
        <div className="container">
            <img className="cover" src={data.image_url} alt={data.title} />
            <h1>{data.title}</h1>
            <div style={{ color: 'var(--muted)' }}>{data.description}</div>
            <h3>Ingredients</h3>
            <ul>{(data.ingredients || []).map((x, i) => <li key={i}>{x}</li>)}</ul>
            <h3>Steps</h3>
            <ol>{(data.steps || []).map((x, i) => <li key={i}>{x}</li>)}</ol>
            <button
                className={styles.deleteBtn}
                onClick={handleDelete}
            >
                Delete Recipe
            </button>


        </div>

    )
}

async function handleDelete() {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
        await API.deleteRecipe(recipe.id);
        alert("Recipe deleted!");
        navigate("/");
    } catch (err) {
        alert("Delete failed: " + err.message);
    }
}
