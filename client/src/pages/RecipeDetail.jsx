import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API } from "../util/api";
import styles from "./RecipeDetail.module.css";

export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        (async () => setData(await API.get(`/recipes/${id}`)))();
    }, [id]);

    if (!data) return null;

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this recipe?")) return;

        try {
            await API.deleteRecipe(id);
            navigate("/");
        } catch (err) {
            alert("Delete failed: " + err.message);
        }
    }

    return (
        <div className={styles.container}>
            <img src={data.image_url} className={styles.cover} />

            <h1 className={styles.title}>{data.title}</h1>

            <p className={styles.description}>{data.description}</p>

            <h3>Ingredients</h3>
            <ul>
                {data.ingredients?.map((i, idx) => (
                    <li key={idx}>{i}</li>
                ))}
            </ul>

            <h3>Steps</h3>
            <ol>
                {data.steps?.map((s, idx) => (
                    <li key={idx}>{s}</li>
                ))}
            </ol>

            <div className={styles.actions}>
                <Link to={`/recipe/${id}/edit`} className="btn secondary">
                    Edit
                </Link>

                <button className={styles.deleteBtn} onClick={handleDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}
