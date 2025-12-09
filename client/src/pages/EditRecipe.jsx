import { useEffect, useState } from "react";
import { API } from "../util/api";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditRecipe.module.css";

export default function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        ingredients: [""],
        steps: [""],
        image_url: "",
    });

    useEffect(() => {
        (async () => {
            const data = await API.get(`/recipes/${id}`);
            setForm(data);
        })();
    }, [id]);

    function updateField(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    function updateArray(field, index, value) {
        setForm((f) => ({
            ...f,
            [field]: f[field].map((v, i) => (i === index ? value : v)),
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        await API.updateRecipe(id, form);
        navigate(`/recipe/${id}`);
    }

    return (
        <div className={styles.container}>
            <h1>Edit Recipe</h1>

            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    className={styles.input}
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Title"
                />

                <textarea
                    className={styles.textarea}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Description"
                    rows={3}
                />

                <h3>Ingredients</h3>
                {form.ingredients.map((ing, i) => (
                    <input
                        key={i}
                        className={styles.input}
                        value={ing}
                        onChange={(e) => updateArray("ingredients", i, e.target.value)}
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

                <h3>Steps</h3>
                {form.steps.map((st, i) => (
                    <input
                        key={i}
                        className={styles.input}
                        value={st}
                        onChange={(e) => updateArray("steps", i, e.target.value)}
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
                    onChange={(e) => updateField("image_url", e.target.value)}
                    placeholder="Image URL"
                />

                <button className={styles.saveBtn} type="submit">
                    Save Changes
                </button>
            </form>
        </div>
    );
}
