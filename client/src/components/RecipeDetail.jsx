import React, { useEffect, useState } from "react";
import { API } from "../api.js";
import { useParams, useNavigate } from "react-router-dom";
import StarRating from "./StarRating.jsx";
import layout from "../styles/Layout.module.css";
import card from "../styles/Card.module.css";

export default function RecipeDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [r, setR] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    API.get(`/recipes/${id}`).then(setR);
    (async () => {
      try {
        const user = await API.getUserRating(id);
        const avg = await API.getAverageRating(id);
        setUserRating(user?.value || 0);
        setAverageRating(avg?.average || 0);
      } catch {}
    })();
  }, [id]);

  async function rate(value) {
    try {
      await API.rateRecipe(Number(id), value);
      setUserRating(value);
      const avg = await API.getAverageRating(id);
      setAverageRating(avg.average);
    } catch (e) {
      alert("Login to rate");
    }
  }

  async function remove() {
    if (!confirm("Delete this recipe?")) return;
    await API.del(`/recipes/${id}`);
    nav("/");
  }

  if (!r) return null;
  const cover = r.image_url || "/default-recipe.png";

  return (
    <div className={layout.container}>
      <div className={card.card}>
        <img className={card.cover} src={cover} alt={r.title} />
        <h1>{r.title}</h1>
        <p>{r.description}</p>

        <h3>Ingredients</h3>
        <ul>{(r.ingredients||[]).map((x,i)=><li key={i}>{x}</li>)}</ul>
        <h3>Steps</h3>
        <ol>{(r.steps||[]).map((x,i)=><li key={i}>{x}</li>)}</ol>

        <div className={card.row}>
          <div>
            <span style={{marginRight:8}}>Average: {averageRating || 0}</span>
            <StarRating value={userRating} onRate={rate} />
          </div>
          <button className={card.btn} onClick={remove}>Delete</button>
        </div>
      </div>
    </div>
  );
}
