import { useState } from "react";
import { API } from "../util/api";
import { useNavigate } from "react-router-dom";
import styles from "./RecipeForm.module.css";

export default function RecipeForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    image_url: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await API.post("/recipes", {
      ...form,
      ingredients: form.ingredients.split("\n"),
      steps: form.steps.split("\n"),
    });

    nav("/");
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Recipe</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className={styles.input}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className={styles.textarea}
        />

        <textarea
          name="ingredients"
          placeholder="One ingredient per line"
          value={form.ingredients}
          onChange={handleChange}
          className={styles.textarea}
        />

        <textarea
          name="steps"
          placeholder="One step per line"
          value={form.steps}
          onChange={handleChange}
          className={styles.textarea}
        />

        <input
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={handleChange}
          className={styles.input}
        />

        <button className={styles.button}>Save Recipe</button>
      </form>
    </div>
  );
}
