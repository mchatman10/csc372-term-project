import React from "react";
import { Link } from "react-router-dom";
import card from "../styles/Card.module.css";

export default function RecipeCard({ r }) {
  const cover = r.image_url || "/default-recipe.png";
  return (
    <div className={card.card}>
      <img className={card.cover} src={cover} alt={r.title} />
      <h3 className={card.title}>{r.title}</h3>
      <div className={card.badges}>
        {(r.categories || []).map(c => <span key={c} className={card.badge}>{c}</span>)}
      </div>
      <div className={card.row}>
        <span>⭐ {r.avg_rating || 0}</span>
        <Link className={card.btnSecondary} to={`/recipe/${r.id}`}>View</Link>
      </div>
    </div>
  );
}
