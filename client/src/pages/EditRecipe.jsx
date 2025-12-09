import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../util/api";
import styles from "./EditRecipe.module.css";

export default function EditRecipe() {
    const { id } = useParams();
    const nav = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        ingredients: [""],
        steps: [""],
        image_url: ""
    });

    useEffect(() => {
        async function load() {
            try {
                const r = await API.get(`/recipes/${id}`);
                setForm({
                    title: r.title,
                    description: r.description,
                    ingredients: r.ingredients,
                    steps: r.steps,
                    image_url: r.image_url || ""
                });
            } catch {
                alert("Failed to load recipe");
            }
        }
        load();
    }, [id]);

    function setAt(field, index, value) {
        setForm(f => ({
            ...f,
            [field]: f[field].map((v, i) => (i === index ? value : v))
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        await API.post(`/recipes/${id}`, form);
        nav(`/recipe/${id}`);
    }

    return (
        <div className={styles.container}>
            <h2>Edit Recipe</h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    className={styles.input}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Title"
                />

                <textarea
                    className={styles.textarea}
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <h4>Ingredients</h4>
                {form.ingredients.map((ing, i) => (
                    <input
                        className={styles.input}
                        key={i}
                        value={ing}
                        onChange={(e) => setAt("ingredients", i, e.target.value)}
                    />
                ))}
                <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() =>
                        setForm((f) => ({ ...f, ingredients: [...f.ingredients, ""] }))
                    }
                >
                    + Add Ingredient
                </button>

                <h4>Steps</h4>
                {form.steps.map((st, i) => (
                    <input
                        className={styles.input}
                        key={i}
                        value={st}
                        onChange={(e) => setAt("steps", i, e.target.value)}
                    />
                ))}
                <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() =>
                        setForm((f) => ({ ...f, steps: [...f.steps, ""] }))
                    }
                >
                    + Add Step
                </button>

                <input
                    className={styles.input}
                    value={form.image_url}
                    placeholder="Image URL"
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />

                <button className={styles.saveBtn}>Save Changes</button>
            </form>
        </div>
    );
}
