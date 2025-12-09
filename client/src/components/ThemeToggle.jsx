import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  function toggle() {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }

  return (
    <button onClick={toggle} className={styles.toggle}>
      Toggle Theme
    </button>
  );
}
