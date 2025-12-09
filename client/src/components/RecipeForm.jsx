import React, { useState } from "react";
import { API } from "../api.js";
import { useNavigate } from "react-router-dom";
import layout from "../styles/Layout.module.css";
import card from "../styles/Card.module.css";

export default function RecipeForm() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [image_url, setImage] = useState("");
  const [nutrition, setNutrition] = useState(null);

  function setAt(setter, index, value) {
    setter(arr => arr.map((v, i) => i === index ? value : v));
  }

  async function analyzeNutrition() {
    try {
      const data = await API.post("/external/nutrition", { ingr: ingredients.filter(Boolean) });
      setNutrition({ cal: data.calories, raw: data.raw });
    } catch { setNutrition({ error: true }); }
  }

  async function submit(e) {
    e.preventDefault();
    const data = await API.post("/recipes", { title, description, ingredients, steps, image_url });
    nav(`/recipe/${data.id}`);
  }

  return (
    <div className={layout.container}>
      <div className={card.card}>
        <h2>New Recipe</h2>
        <form onSubmit={submit}>
          <input className={card.input} placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className={card.textarea} rows="3" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />

          <h4>Ingredients</h4>
          {ingredients.map((ing, i) => (
            <input key={i} className={card.input} placeholder="e.g. 1 cup rice" value={ing} onChange={e => setAt(setIngredients, i, e.target.value)} />
          ))}
          <button type="button" className={card.btnSecondary} onClick={() => setIngredients(a => [...a, ""])}>+ Add Ingredient</button>

          <h4>Steps</h4>
          {steps.map((st, i) => (
            <input key={i} className={card.input} placeholder={`Step ${i+1}`} value={st} onChange={e => setAt(setSteps, i, e.target.value)} />
          ))}
          <button type="button" className={card.btnSecondary} onClick={() => setSteps(a => [...a, ""])}>+ Add Step</button>

          <input className={card.input} placeholder="Image URL (optional)" value={image_url} onChange={e=>setImage(e.target.value)} />

          <div className={card.row}>
            <button type="button" className={card.btnSecondary} onClick={analyzeNutrition}>Analyze Nutrition</button>
            <button className={card.btn} type="submit">Save Recipe</button>
          </div>
        </form>

        {nutrition && (
          <div>
            {nutrition.error ? <p>Nutrition unavailable.</p> : (
              <p><b>Estimated Calories:</b> {nutrition.cal}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
