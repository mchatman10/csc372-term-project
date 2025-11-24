import { useState } from 'react';
import { API } from '../api';
import { useNavigate } from 'react-router-dom';
import styles from './RecipeForm.module.css';

export default function RecipeForm() {
    const nav = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    the[steps, setSteps] = useState(['']);
    const [image_url, setImage] = useState('');
    const [nutrition, setNutrition] = useState(null);

    function setAt(setter, index, value) {
        setter(arr => arr.map((v, i) => (i === index ? value : v)));
    }

    async function submit(e) {
        e.preventDefault();
        const data = await API.post('/recipes', {
            title, description, ingredients, steps, image_url
        });
        nav(`/recipe/${data.id}`);
    }

    return (
        <div className={styles.wrapper}>
            <div className="card">
                <h2>New Recipe</h2>

                <form onSubmit={submit} className={styles.form}>
                    <input className="input" placeholder="Title"
                        value={title} onChange={e => setTitle(e.target.value)} />

                    <textarea className="textarea" rows="3" placeholder="Description"
                        value={description} onChange={e => setDescription(e.target.value)} />

                    <h4>Ingredients</h4>
                    {ingredients.map((ing, i) => (
                        <input key={i}
                            className="input"
                            placeholder="e.g. 1 cup rice"
                            value={ing}
                            onChange={e => setAt(setIngredients, i, e.target.value)}
                        />
                    ))}

                    <button type="button" className="btn secondary"
                        onClick={() => setIngredients(a => [...a, ''])}>
                        + Add Ingredient
                    </button>

                    <h4>Steps</h4>
                    {steps.map((st, i) => (
                        <input key={i}
                            className="input"
                            placeholder={`Step ${i + 1}`}
                            value={st}
                            onChange={e => setAt(setSteps, i, e.target.value)}
                        />
                    ))}

                    <button type="button" className="btn secondary"
                        onClick={() => setSteps(a => [...a, ''])}>
                        + Add Step
                    </button>

                    <input className="input" placeholder="Image URL (optional)"
                        value={image_url} onChange={e => setImage(e.target.value)} />

                    <div className={styles.btnRow}>
                        <button className="btn secondary" type="button">Analyze Nutrition</button>
                        <button className="btn" type="submit">Save Recipe</button>
                    </div>
                </form>

                {nutrition && (
                    <div className={styles.nutritionBox}>
                        {nutrition.error ? (
                            <p>Nutrition unavailable.</p>
                        ) : (
                            <p><b>Estimated Calories:</b> {nutrition.cal}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
